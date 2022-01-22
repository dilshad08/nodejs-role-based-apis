const router = require("express").Router();
const StudentController = require("../Controllers/student.controller");

const { isInstructor } = require("../helpers/helper");

router.get("/", isInstructor, StudentController.getStudent);

router.post("/add", isInstructor, StudentController.postStudent);

// router.patch("/update", isInstructor, StudentController.patchStudent);

router.delete("/delete", isInstructor, StudentController.deleteStudent);

module.exports = router;
