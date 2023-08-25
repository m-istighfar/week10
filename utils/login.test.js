const { login } = require("../service/auth-service.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const StandardError = require("../standard-error.js");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  it("[POSITIVE] should successfully login a user", async () => {
    const user = {
      username: "user123",
      password: "!@#123",
    };
    const collectionMock = {
      findOne: jest.fn().mockReturnValue(user),
    };
    const dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock),
    };
    const reqMock = { db: dbMock, body: user };

    jest.spyOn(bcrypt, "compare").mockReturnValue(true);
    jest.spyOn(jwt, "sign").mockReturnValue("token");

    const statusJsonMock = {
      json: jest.fn(),
    };
    const resMock = {
      status: jest.fn().mockReturnValue(statusJsonMock),
    };

    await login(reqMock, resMock, null);

    // assertions
    expect(dbMock.collection).toHaveBeenCalledWith("users");
    expect(collectionMock.findOne).toHaveBeenCalledWith({
      username: "user123",
    });
    expect(bcrypt.compare).toHaveBeenCalledWith("!@#123", user.password);
    expect(jwt.sign).toHaveBeenCalled();
    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(statusJsonMock.json).toHaveBeenCalledWith({
      message: "User successfully logged in",
      data: "token",
    });
  });
});
