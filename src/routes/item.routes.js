const { Router } = require("express");

const ItemController = require("../controllers/ItemController");

const itemRoutes = Router();

const itemController = new ItemController();

itemRoutes.get("/bygroup/:group", itemController.index);
itemRoutes.get("/:id", itemController.show);
itemRoutes.post("/create", itemController.create);
itemRoutes.delete("/:id", itemController.delete);
itemRoutes.put("/:id", itemController.update);

module.exports = itemRoutes;