describe("My First Test", function() {
  it("Visits the Kitchen Sink", function() {
    cy.visit("http://localhost:3000/");
    cy.contains("Home").click();
    cy.contains("Login").click();
    cy.contains("Home").click();
    cy.contains("Sign up").click();
    cy.contains("Home").click();
    cy.get("input[name=searchInput]").type("test");
    cy.contains("Submit").click();
    cy.get("input[name=searchInput]").clear()
    cy.get("input[name=searchInput]").type("badman");
    cy.contains("Submit").click();
    cy.get("input[name=searchInput]").clear()
    cy.get("input[name=searchInput]").type("maxs");
    cy.contains("Submit").click();
    cy.get("input[name=searchInput]").clear()
    cy.get("input[name=searchInput]").type("story");
    cy.contains("Submit").click();
  });
});
