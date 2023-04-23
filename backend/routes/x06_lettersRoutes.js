const express = require("express");
const { getReport } = require("../controllers/reportControlller");

const router =  express.Router();

router.route("/").get(getReport);

module.exports = router;