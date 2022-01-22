const router = require("express").Router();
const ClassController = require("../Controllers/class.controller");

const { isInstructor } = require("../helpers/helper");

router.get("/", ClassController.getClass);

router.post("/add", isInstructor, ClassController.postClass);

router.patch("/update/:id", isInstructor, ClassController.patchClass);

router.delete("/delete", isInstructor, ClassController.deleteClass);

module.exports = router;
