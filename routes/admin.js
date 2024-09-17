const express = require("express");
const router = require("express-promise-router")();
const AdminControllers = require("../controllers/admin");

router.route("/signin").post(AdminControllers.signIn);

module.exports = router;
