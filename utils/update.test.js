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
