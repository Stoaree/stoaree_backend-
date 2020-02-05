const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');

const Story = require("../src/models/Story");
const User = require("../src/models/User");
const Comment = require("../src/models/Comment");
const Question = require("../src/models/Question");

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

  test("Login with incorrect password", async (done) => {
    await request(app).post("/login")
      .send({ email: validEmail, password: "1234" })
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

  test("Try to create new story with missing title", async done => {
    await request(app).post("/stories")
      .set("Authorization", token)
      .send({
        description: "Test description",
        tags: ["test", "cool"],
        isPublic: true,
        imageURL: "http://fakeurl.png"
      })
      .expect(400);
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

  test("Search for a story by title", async done => {
    await request(app).get("/search/test")
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(1);
      });
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

  test("Answer a question for a story", async done => {
    const story = await Story.findOne();
    await request(app).post(`/questions/${story._id}`)
      .set("Authorization", token)
      .send({
        question: {
          title: "Test question",
          audioFileURL: "fakeurl.mp3"
        }
      })
      .expect(200)
    const updatedStory = await Story.findOne();
    expect(updatedStory.questions.length).toBe(1);
    const question = await Question.findById(updatedStory.questions[0]);
    expect(question.title).toBe("Test question");
    done();
  })

  test("Like a story", async done => {
    const story = await Story.findOne();
    await request(app).put("/likes")
      .set("Authorization", token)
      .send({
        story_id: story._id
      })
      .expect(200)
      .then(async res => {
        expect(res.body.bookmarks.length).toBe(1);
        const updatedStory = await Story.findOne();
        expect(updatedStory.likes).toBe(1);
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
    await request(app).get("/users/123456123456123456123456")
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

  test("Try to get current user while not logged in", async done => {
    await request(app).get("/users/current")
      .expect(403);
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
      .expect(200)
      .then(async res => {
        expect(res.body.text).toBe("Test comment");
        const updatedStory = await Story.findOne();
        expect(JSON.stringify(updatedStory.comments[0])).toBe(JSON.stringify(res.body._id));
        const comment = await Comment.findById(updatedStory.comments[0]);
        expect(comment.text).toBe("Test comment");
      });
    done();
  })

  test("Get comments for a story", async done => {
    await request(app).get(`/comments/${story._id}`)
      .expect(200);
    done();
  });

  test("Edit a comment", async done => {
    await request(app).post(`/comments/${story._id}`)
      .set("Authorization", token)
      .send({ text: "Comment for editing" });

    const comment = await Comment.findOne({ text: "Comment for editing" });
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
    await request(app).post(`/comments/${story._id}`)
      .set("Authorization", token)
      .send({ text: "Comment to delete" });

    let comment = await Comment.findOne({ text: "Comment to delete" });
    await request(app).delete(`/comments/${story._id}/${comment._id}`)
      .set("Authorization", token)
      .expect(200)

    comment = await Comment.findOne({ text: "Comment to delete" });
    expect(comment).toBeNull();
    done();
  });

  test("Try to get comments for a nonexistent story", async done => {
    await request(app).get("/comments/testtesttesttesttesttest")
      .expect(400);
    done();
  });
});

describe("Test admin features", () => {
  let token;

  beforeAll(async () => {
    let user = await User.findOne();
    user.isAdmin = true;
    await user.save();

    res = await request(app).post("/login")
      .send({ email: validEmail, password: validPassword });
    token = res.body.token;
  });

  test("Get question master list", async done => {
    await request(app).get("/questions/admin")
      .set("Authorization", token)
      .expect(200)
    done();
  });

  test("Add new question to master list", async done => {
    await request(app).post("/questions/admin")
      .set("Authorization", token)
      .send({ title: "Test question", order: 1, isTopLevel: true })
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe("Test question");
      })
    done();
  });

  test("Try to add new question with missing title", async done => {
    await request(app).post("/questions/admin")
      .set("Authorization", token)
      .send({ order: 1, isTopLevel: true })
      .expect(400);
    done();
  });

  test("Add new child question to an existing question", async done => {
    const parentQuestion = await Question.findOne();

    await request(app).post("/questions/admin")
      .set("Authorization", token)
      .send({ title: "Child question", order: 1, parentQuestionId: parentQuestion._id })
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(2);
        expect(res.body[1].title).toBe("Child question");
      })
    done();
  });

  test("Delete child question from master list", async done => {
    const question = await Question.findOne({ title: "Child question" });

    await request(app).delete(`/questions/admin/${question._id}`)
      .set("Authorization", token)
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(1);
      })
    done();
  });

  test("Edit question in master list", async done => {
    const question = await Question.findOne();

    await request(app).put(`/questions/admin/${question._id}`)
      .set("Authorization", token)
      .send({ title: "Updated question" })
      .expect(200)

    const updatedQuestion = await Question.findById(question._id);
    expect(updatedQuestion.title).toBe("Updated question");
    done();
  });

  test("Delete top level question from master list", async done => {
    const question = await Question.findOne({ isTopLevel: true });

    await request(app).delete(`/questions/admin/${question._id}`)
      .set("Authorization", token)
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(0);
      })
    done();
  });
});

describe("Test AWS functions", () => {
  test("Get an AWS signature", async done => {
    await request(app).post("/sign_s3")
      .send({
        fileName: "test.png",
        fileType: "image/png"
      })
      .expect(200)
      .then(res => {
        expect(res.body.success).toBeTruthy();
      });
    done();
  })
});

describe("Test authentication", () => {
  test("Make request with invalid token", async done => {
    await request(app).get("/users/current")
      .set("Authorization", "12345")
      .expect(403);
    done();
  })
})