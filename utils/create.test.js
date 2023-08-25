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
