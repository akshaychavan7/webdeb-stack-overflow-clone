const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");

jest.mock("../models/comments");

let server;
let moderatorCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjQ5MDJiNDVjNGEwNjk3NWM4MmEiLCJ1c2VybmFtZSI6Im1vZGVyYXRvciIsInVzZXJSb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzEzNTY2ODkxLCJleHAiOjE3MTM2NTMyOTF9.dEr4tqgNoZYl02PFv7KGQMoq2PmNEty9r7jCIcp-v48; Expires=Tue, 19 Jan 2038 03:14:07 GMT; Path=/; Secure; HttpOnly"
let moderatorUserId = "6622f4902b45c4a06975c82a"
let generalCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjVkMjhiNTM0ODYxYjhmZTcyNzIiLCJ1c2VybmFtZSI6ImdlbmVyYWwiLCJ1c2VyUm9sZSI6ImdlbmVyYWwiLCJpYXQiOjE3MTM1Njc0NzMsImV4cCI6MTcxMzY1Mzg3M30.0CVom301AncKsC6GdaOuVf_aoppdhksWUcAgBXgNJ9w; Expires=Sat, 20 Apr 2024 23:57:53 GMT; Path=/; Secure; HttpOnly"
let generalUserId = "6622f5d28b534861b8fe7272"



describe("Is User Authenticated", () => {
  beforeAll(() => {
    server = require("../server");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("should return 200 if user is authenticated", async () => {
    const response = await supertest(server)
      .get("/isUserAuthenticated")
      .set("Cookie", generalCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User is authenticated" });
  });

  it("should return 403 if user is not authenticated", async () => {
    const response = await supertest(server).get("/isUserAuthenticated");

    expect(response.status).toBe(403);
  });
});


describe("Is Moderator Authenticated", () => {
  beforeAll(() => {
    server = require("../server");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("should return 200 if moderator is authenticated", async () => {
    const response = await supertest(server)
      .get("/isUserModeratorAuthenticated")
      .set("Cookie", moderatorCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User is authenticated" });
  });

  it("should return 403 if user is not authenticated", async () => {
    const response = await supertest(server).get("/isUserModeratorAuthenticated");

    expect(response.status).toBe(403);
  });
});



describe("Logout", () => {
  beforeAll(() => {
    server = require("../server");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("should return 200 if user is logged out", async () => {
    const response = await supertest(server)
      .get("/logout")
      .set("Cookie", generalCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 200, message: "Successfully logged out" });
  });

  it("should return 403 if user is not authenticated", async () => {
    const response = await supertest(server).get("/logout");

    expect(response.status).toBe(403);
  });
});


describe("Check authroization middleware", () => {
  beforeAll(() => {
    server = require("../server");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("general should return 403 if token is valid", async () => {
    const response = await supertest(server).get("/isUserAuthenticated")
      .set("Cookie", "access_token=invalid");

    expect(response.status).toBe(403);
  });

  it("moderator should return 403 if token is valid", async () => {
    const response = await supertest(server).get("/isUserModeratorAuthenticated")
      .set("Cookie", "access_token=invalid");

    expect(response.status).toBe(403);
  });
});
