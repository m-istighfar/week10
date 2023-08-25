const { register } = require("../service/auth-service.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const StandardError = require("../standard-error.js");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  it("[POSITIVE] should success to register new user", async () => {
    const user = {
      username: "user123",
      password: "pass123",
      role: "admin",
    };

    const collectionMock = {
      findOne: jest.fn().mockReturnValue(null),
      insertOne: jest.fn().mockReturnValue(user),
    };
    const dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock),
    };

    const reqMock = { db: dbMock, body: user };

    jest.spyOn(bcrypt, "hash").mockReturnValue("!@#123");

    const statusJsonMock = {
      json: jest.fn(),
    };
    const resMock = {
      status: jest.fn().mockReturnValue(statusJsonMock),
    };

    await register(reqMock, resMock, null);

    expect(dbMock.collection).toHaveBeenCalledTimes(2);
    expect(dbMock.collection).toHaveBeenNthCalledWith(1, "users");
    expect(collectionMock.findOne).toHaveBeenCalledWith({
      username: "user123",
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
    expect(dbMock.collection).toHaveBeenNthCalledWith(2, "users");
    expect(collectionMock.insertOne).toHaveBeenCalledWith({
      username: "user123",
      password: "!@#123",
      role: "admin",
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(statusJsonMock.json).toHaveBeenCalledWith({
      message: "User successfully registered",
      data: user,
    });
  });
});
