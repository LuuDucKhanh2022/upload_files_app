const express = require("express");
const { createIntern, fetchInterns } = require("../controllers/internController");
const router = express.Router();
router.route("/").get(fetchInterns).post(createIntern);
module.exports= router;
