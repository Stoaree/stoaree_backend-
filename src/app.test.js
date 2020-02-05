const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');

const Story = require("../src/models/Story");
const User = require("../src/models/User");
const Comment = require("../src/models/Comment");

const validEmail = "newuser@test.com";
const validPassword = "password"

beforeAll(() => {
  mongoose.connect(
    "mongodb://localhost:27017/", { dbName: process.env.DB_NAME }, () => {
      mongoose.connection.db.dropDatabase();
    }
  );
});

describe("Test the homepage", () => {
  test("Access homepage", async (done) => {
    await request(app).get('/').expect(200);
    done();
  });
});

describe("Test registration", () => {
  test("Register new user with valid details", async done => {
    await request(app).post("/signup")
      .send({
        email: validEmail,
        password: validPassword,
        firstName: "Test",
        lastName: "User",
        displayName: "Testy"
      })
      .expect(200);
    done();
  });

  test("Try to register with missing email", async done => {
    await request(app).post("/signup")
      .send({
        email: null,
        password: validPassword,
        firstName: "Test",
        lastName: "User",
        displayName: "Testy"
      })
      .expect(400);
    done();
  })
})

describe("Test login", () => {
  test("Login with valid credentials", async (done) => {
    await request(app).post("/login")
      .send({ email: validEmail, password: validPassword })
      .expect(200);
    done();
  });

  test("Login with incorrect username and password", async (done) => {
    await request(app).post("/login")
      .send({ email: "notanemail", password: "1234" })
      .expect(403);
    done();
  });

  test("Login with no username and password", async (done) => {
    await request(app).post("/login")
      .send({ email: null, password: null })
      .expect(400);
    done();
  });
});

describe("Test story routes", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post("/login")
      .send({ email: validEmail, password: validPassword });
    token = res.body.token;
  })

  test("Create new story with valid details", async done => {
    await request(app).post("/stories")
      .set("Authorization", token)
      .send({
        title: "Test title",
        description: "Test description",
        tags: ["test", "cool"],
        isPublic: true,
        imageURL: "http://fakeurl.png"
      })
      .expect(200);
    done();
  });

  test("Get all stories", async done => {
    await request(app).get("/stories")
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(1);
      })
    done();
  });

  test("Get a story from an id", async done => {
    const story = await Story.findOne();
    await request(app).get(`/stories/${story._id}`)
      .expect(200);
    done();
  });

  test("Try to get a nonexistent story", async done => {
    await request(app).get("/stories/testtesttesttesttesttest")
      .expect(400);
    done();
  });

  test("Edit a story", async done => {
    const story = await Story.findOne();
    await request(app).put(`/stories/${story._id}`)
      .set("Authorization", token)
      .send({
        title: "New title",
        tags: []
      })
      .expect(200)
      .then(res => {
        expect(res.body.title).toBe("New title");
      });
    done();
  });

  test("Like a story", async done => {
    const story = await Story.findOne();
    await request(app).put("/likes")
      .set("Authorization", token)
      .send({
        story_id: story._id
      })
      .expect(200)
      .then(res => {
        expect(res.body.bookmarks).toContain(story._id);
        expect(story.likes).toBe(1);
      });
    done();
  })

  test("Delete a story", async done => {
    const story = await Story.findOne();
    await request(app).delete(`/stories/${story._id}`)
      .set("Authorization", token)
      .expect(200);

    const deletedStory = await Story.findById(story._id);
    expect(deletedStory).toBeNull();
    done();
  })
});

describe("Test user profiles", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post("/login")
      .send({ email: validEmail, password: validPassword });
    token = res.body.token;
  });

  test("Get a user profile from an id", async done => {
    const user = await User.findOne();
    await request(app).get(`/users/${user._id}`)
      .expect(200)
      .then(res => {
        expect(res.body.email).toBe(validEmail);
      })
    done();
  });

  test("Try to get a nonexistent user profile", async done => {
    await request(app).get("/users/testtesttesttesttesttest")
      .expect(400);
    done();
  });

  test("Update profile", async done => {
    await request(app).put("/users/profile")
      .set("Authorization", token)
      .send({ firstName: "Newname" })
      .expect(200)
      .then(res => {
        expect(res.body.firstName).toBe("Newname");
      })
    done();
  });

  test("Get current user", async done => {
    await request(app).get("/users/current")
      .set("Authorization", token)
      .expect(200)
      .then(res => {
        expect(res.body.success).toBeTruthy();
        expect(res.body.email).toBe(validEmail);
      })
    done();
  });
});

describe("Test comment routes", () => {
  let res, token, story;

  beforeAll(async () => {
    res = await request(app).post("/login")
      .send({ email: validEmail, password: validPassword });
    token = res.body.token;

    res = await request(app).post("/stories")
      .set("Authorization", token)
      .send({
        title: "Comments Testing"
      });
    story = res.body;
  });

  test("Post a comment", async done => {
    await request(app).post(`/comments/${story._id}`)
      .set("Authorization", token)
      .send({ text: "Test comment" })
      .expect(200);
    done();
  })

  test("Get comments for a story", async done => {
    request(app).get(`/comments/${story._id}`)
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(1);
        // expect(res.body[0].text).toBe("Test comment");
      });
    done();
  });

  test("Edit a comment", async done => {
    const comment = Comment.findOne();
    await request(app).put(`/comments/${story._id}/${comment._id}`)
      .set("Authorization", token)
      .send({ text: "Updated comment" })
      .expect(200)
      .then(res => {
        expect(res.body.text).toBe("Updated comment");
      });
    done();
  });

  test("Delete a comment", async done => {
    const comment = Comment.findOne();
    await request(app).delete(`/comments/${story._id}/${comment._id}`)
      .set("Authorization", token)
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(0);
      });
    done();
  });
})