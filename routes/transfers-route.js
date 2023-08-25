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
