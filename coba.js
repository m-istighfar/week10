// jwt.js

const JWT_SIGN = process.env.JWT_SIGN;

module.exports = {
  JWT_SIGN,
};


// openapi.yaml

openapi: 3.0.0
info:
  title: Transfer Request Management API
  description: API documentation for the Transfer Request Management system
  version: 1.0.0
servers:
  - url: http://localhost:3000
    description: Local server
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

paths:
  /auth/register:
    post:
      summary: Register a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  minLength: 1
                role:
                  type: string 
                  enum : [admin, maker, approver]
                password:
                  type: string
                  pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$
              required:
                - username
                - role
                - password
      responses:
        '200':
          description: User successfully registered
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  data:
                    type: object
                    properties:
                      id:
                        type: integer
                      username:
                        type: string
                      role:
                        type: string
        '400':
          description: 'Bad Request'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
          

  /auth/login:
    post:
      summary: Log in with username and password
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: User successfully logged in
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  data:
                    type: string
                       
        '400':
          description: 'Bad Request'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

  /transfers:
    post:
      security:
        - bearerAuth: []
      summary: Create a new transfer request
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                amount:
                  type: number
                currency:
                  type: string
                sourceAccount:
                  type: string
                destinationAccount:
                  type: string
      responses:
        '200':
          description: Transfer request created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  data:
                    type: object
                    properties:
                      _id:
                        type: string
                      amount:
                        type: number
                      currency:
                        type: string
                      sourceAccount:
                        type: string
                      destinationAccount:
                        type: string
                      status:         
                        type: string  

        '400':
          description: 'Bad Request'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

        '403':
          description: 'Permission denied'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

    get:
      security:
        - bearerAuth: []
      summary: Get a list of transfer requests
      responses:
        '200':
          description: 'List of transfer requests successfully retrieved'
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    _id:
                      type: string
                    amount:
                      type: number
                    currency:
                      type: string
                    sourceAccount:
                      type: string
                    destinationAccount:
                      type: string
                    status:
                      type: string
                    createdAt:
                      type: string
                    updatedAt:
                      type: string
        '403':
          description: 'Permission Denied'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

  /transfers/{id}:
    patch:
      security:
        - bearerAuth: []
      summary: Update the status of a transfer request
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [rejected, approved]
      responses:
        '200':
          description: 'Transfer status updated successfully'
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string

        '400':
          description: 'Bad Request'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

        '404':
          description: 'Transfer not found'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

        '500':
          description: 'Internal Server Error'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

    delete:
      security:
        - bearerAuth: []
      summary: Soft delete a transfer request
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: 'Transfer soft deleted successfully'
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string

        '403':
          description: 'Forbidden'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: 'Forbidden'
                  message:
                    type: string

        '404':
          description: 'Transfer not found or already deleted'
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string

        '500':
          description: 'Internal Server Error'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string


  /transfers/history:
    get:
      security:
        - bearerAuth: []
      summary: Get transfer request history based on filters
      parameters:
        - name: startDate
          in: query
          schema:
            type: string
        - name: endDate
          in: query
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: array
            items:
              type: string
      responses:
        '200':
          description: 'Transfer history successfully retrieved'
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    _id:
                      type: string
                    amount:
                      type: number
                    currency:
                      type: string
                    sourceAccount:
                      type: string
                    destinationAccount:
                      type: string
                    status:
                      type: string
                    createdAt:
                      type: string
                    updatedAt:
                      type: string
        '403':
          description: 'Forbidden'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string

        '500':
          description: 'Internal Server Error'
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string



// authentication-middleware.js

const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../config/jwt.js");

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SIGN);
    console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = authenticationMiddleware;


// authorization-middleware.js

const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../config/jwt.js");

const authorizationMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, JWT_SIGN);
      console.log("Decoded Token:", decodedToken);

      console.log("Allowed Roles:", allowedRoles);

      if (allowedRoles.includes(decodedToken.role)) {
        next();
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
};

module.exports = authorizationMiddleware;


// database-middleware.js

const { MongoClient } = require("mongodb");

const databaseMiddleware = async (req, res, next) => {
  try {
    console.log("try connect.");

    const mongoClient = await new MongoClient(
      "mongodb://127.0.0.1:27017"
    ).connect();

    console.log("Connected to MongoDB");

    const db = mongoClient.db("week10");

    console.log(`Using database: ${db.databaseName}`);

    req.db = db;
    next();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).send("Failed to connect to MongoDB");
  }
};

module.exports = databaseMiddleware;


// auth-route.js

const { Router } = require("express");
const { register, login } = require("../service/auth-service.js");

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

module.exports = authRouter;


// transfers-route.js

const { Router } = require("express");
const {
  createTransfer,
  getTransfers,
  updateTransfer,
  deleteTransfer,
  getTransferHistory,
} = require("../service/transfers-service.js");
const authorizationMiddleware = require("../middleware/authorization-middleware");

const transfersRouter = Router();

transfersRouter.post("/", createTransfer);
transfersRouter.get("/", getTransfers);

transfersRouter.patch(
  "/:id",
  authorizationMiddleware(["approver", "admin"]),
  updateTransfer
);

transfersRouter.delete(
  "/:id",
  authorizationMiddleware(["admin"]),
  deleteTransfer
);
transfersRouter.get(
  "/history",
  authorizationMiddleware(["admin"]),
  getTransferHistory
);

module.exports = transfersRouter;


// auth-service.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../config/jwt.js");

const register = async (req, res) => {
  const { username, password, role } = req.body;

  // const acceptedRoles = ["maker", "approver", "admin"];

  // if (!acceptedRoles.includes(role)) {
  //   return res.status(400).json({ error: "Invalid role" });
  // }

  try {
    const user = await req.db.collection("users").findOne({ username });

    if (user) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await req.db
      .collection("users")
      .insertOne({ username, password: hashedPassword, role });
    res.status(200).json({
      message: "User successfully registered",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await req.db.collection("users").findOne({ username });

    if (!user) {
      throw new Error("Username does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = jwt.sign(
        { username: user.username, id: user._id, role: user.role },
        JWT_SIGN
      );

      console.log(token);

      res.status(200).json({
        message: "User successfully logged in",
        data: token,
      });
    } else {
      res.status(400).json({ error: "Password is incorrect" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};


// transfers-service.js

const { ObjectId } = require("mongodb");

const createTransfer = async (req, res) => {
  const { amount, currency, sourceAccount, destinationAccount } = req.body;
  const { role } = req.user;

  if (role === "maker" || role === "admin" || role === "approver") {
    const newTransfer = {
      amount,
      currency,
      sourceAccount,
      destinationAccount,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await req.db.collection("transfers").insertOne(newTransfer);
    res.status(200).json({ newTransfer });
  } else {
    res.status(403).json({ error: "Permission denied" });
  }
};

const getTransfers = async (req, res) => {
  const transfers = await req.db
    .collection("transfers")
    .find({
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
    })
    .toArray();

  res.status(200).json(transfers);
};

const updateTransfer = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // if (status !== "approved" && status !== "rejected") {
  //   return res.status(400).json({ error: "Invalid status" });
  // }

  try {
    const existingTransfer = await req.db
      .collection("transfers")
      .findOne({ _id: new ObjectId(id) });

    if (!existingTransfer) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    if (existingTransfer.status !== "pending") {
      return res
        .status(403)
        .json({ error: "Only pending transfers can be updated" });
    }

    const result = await req.db
      .collection("transfers")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    if (result.modifiedCount === 1) {
      return res
        .status(200)
        .json({ message: "Transfer status updated successfully" });
    }

    return res.status(400).json({ error: "Could not update transfer" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `An error occurred: ${error.message}` });
  }
};

const deleteTransfer = async (req, res) => {
  const transferId = req.params.id;

  try {
    const decodedToken = req.user;

    if (decodedToken.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const transfer = await req.db
      .collection("transfers")
      .findOne({ _id: new ObjectId(transferId) });

    if (!transfer) {
      res.status(404).json({ message: "Transfer not found" });
      return;
    }

    if (transfer.status !== "pending") {
      res
        .status(403)
        .json({ message: "Only pending transfers can be deleted" });
      return;
    }

    const result = await req.db
      .collection("transfers")
      .updateOne(
        { _id: new ObjectId(transferId) },
        { $set: { isDeleted: true } }
      );

    if (result.modifiedCount === 0) {
      res
        .status(404)
        .json({ message: "Transfer not found or already deleted" });
      return;
    }

    res.status(200).json({ message: "Transfer soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTransferHistory = async (req, res) => {
  try {
    const decodedToken = req.user;

    if (decodedToken.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const status = req.query.status
      ? Array.isArray(req.query.status)
        ? req.query.status
        : [req.query.status]
      : null;

    let query = {
      isDeleted: { $ne: true },
    };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate.setHours(0, 0, 0, 0));
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate.setHours(23, 59, 59, 999));
      }
    }

    if (status) {
      query.status = { $in: status };
    }

    const transfers = await req.db
      .collection("transfers")
      .find(query)
      .toArray();
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTransfer,
  getTransfers,
  updateTransfer,
  deleteTransfer,
  getTransferHistory,
};


// create.test.js

const { createTransfer } = require("../service/transfers-service.js");

describe("Transfer Controller", () => {
  it("[POSITIVE] should successfully create a transfer for a maker", async () => {
    const request = {
      amount: 1000,
      currency: "USD",
      sourceAccount: "account1",
      destinationAccount: "account2",
    };

    const mockUser = { role: "maker" };

    const collectionMock = {
      insertOne: jest.fn().mockReturnValue(request),
    };

    const dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock),
    };

    const reqMock = {
      db: dbMock,
      body: request,
      user: mockUser,
    };

    const statusJsonMock = {
      json: jest.fn(),
    };

    const resMock = {
      status: jest.fn().mockReturnValue(statusJsonMock),
    };

    await createTransfer(reqMock, resMock);

    expect(dbMock.collection).toHaveBeenCalledWith("transfers");
    expect(collectionMock.insertOne).toHaveBeenCalledWith({
      ...request,
      status: "pending",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(statusJsonMock.json).toHaveBeenCalledWith({
      newTransfer: {
        ...request,
        status: "pending",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});


// login.test.js

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


// register.test.js

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


// update.test.js

const { ObjectId } = require("mongodb");
const { updateTransfer } = require("../service/transfers-service.js");

describe("Transfer Controller", () => {
  it("[POSITIVE] should successfully approve a transfer request", async () => {
    const requestId = new ObjectId("64e7f1226d7491d02285f456");

    const collectionMock = {
      updateOne: jest.fn().mockReturnValue({
        matchedCount: 1,
        modifiedCount: 1,
      }),
      findOne: jest.fn().mockReturnValue({
        _id: requestId,
        status: "pending",
      }),
    };

    const dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock),
    };

    const reqMock = {
      db: dbMock,
      params: { id: requestId.toString() },
      body: { status: "approved" },
    };

    const statusJsonMock = {
      json: jest.fn(),
    };
    const resMock = {
      status: jest.fn().mockReturnValue(statusJsonMock),
    };

    await updateTransfer(reqMock, resMock);

    expect(dbMock.collection).toHaveBeenCalledWith("transfers");
    expect(dbMock.collection().findOne).toHaveBeenCalledWith({
      _id: requestId,
    });
    expect(dbMock.collection().updateOne).toHaveBeenCalledWith(
      { _id: requestId },
      { $set: { status: "approved" } }
    );
    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(statusJsonMock.json).toHaveBeenCalledWith({
      message: "Transfer status updated successfully",
    });
  });
});


// .env

JWT_SIGN='mysecret'

// app.js

require("dotenv").config();

const express = require("express");
const databaseMiddleware = require("./middleware/database-middleware.js");
const authRouter = require("./routes/auth-route.js");
const transfersRouter = require("./routes/transfers-route.js");
const authMiddleware = require("./middleware/authentication-middleware.js");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const OpenApiValidator = require("express-openapi-validator");

const openApiPath = "doc/openapi.yaml";
const file = fs.readFileSync(openApiPath, "utf8");
const swaggerDocument = yaml.parse(file);

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiPath,
    validateRequests: true,
  })
);
app.use(databaseMiddleware);

app.use("/auth", authRouter);
app.use("/transfers", authMiddleware, transfersRouter);

app.use((err, req, res, next) => {
  console.log(err, `<=================== error ==================`);
  res.status(err.status || 500).json({
    message: err.message,
    // errors: err.errors,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
