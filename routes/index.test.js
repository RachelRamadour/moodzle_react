var app = require("../app");
var request = require("supertest");

test("Inscription avec un utilisateur déjà existant", async (done) => {
  await request(app)
    .post("/sign-up")
    .send({
      email: "rramadour@gmail.com",
      password: "abcd",
      username: "Shakur",
    })
    .expect({ result: false, token: null });
  done();
});

test("Connexion de l'utilisateur Shakur réussie", async (done) => {
  await request(app)
    .post("/sign-in")
    .send({ email: "rramadour@gmail.com", password: "abcd" })
    .expect({
      result: true,
      msg: "login success",
      username: "Shakur",
      token: "M9NGVIayYHGjh75ASTnYKq4GlHyBpPwk",
    });
  done();
});

test("modifications du pseudo", async (done) => {
  await request(app)
    .post("/modifications")
    .send({
      token: "M9NGVIayYHGjh75ASTnYKq4GlHyBpPwk",
      usernameModified: "Biggy",
    })
    .expect({
      msg: `Modification du pseudo réalisée avec succès pour l'utilisateur ${token}`,
    });
  done();
});

module.exports = {
  testEnvironment: "node",
};
