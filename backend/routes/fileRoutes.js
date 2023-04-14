const express = require("express");
const upload = require("../models/multerModel");
const {
  uploadSingle,
  getFiles,
  uploadMutiple,
  getSingleFile,
} = require("../controllers/fileController");
const router = express.Router();

router.route("/").get(getFiles).post(uploadSingle);
router.route("/mutiple").post(uploadMutiple);
router.route("/:fileId").get(getSingleFile);
module.exports = router;
