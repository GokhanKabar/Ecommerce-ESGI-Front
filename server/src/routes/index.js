const { Router } = require("express");
const { HelloController } = require("../controllers/helloController.js");

const indexRouter = Router();

indexRouter.get("/", HelloController.index);

module.exports = { indexRouter };
