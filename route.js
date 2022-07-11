const express = require("express");

const { check } = require("express-validator");

const compute = require("./controller");
const router = express.Router();



router.post(
  "/compute",
  [
    check("ID").isNumeric().withMessage("ID should be numeric"),
    check(
      "SplitInfo",
      "SplitInfo should be an array of entities not more than 20"
    )
      .isArray()
      .custom((item) => item.length <= 20),
    check("SplitInfo.*.SplitType")
      .not()
      .isEmpty()
      .withMessage("SplitType should not be empty"),
    check("SplitInfo.*.SplitValue")
      .not()
      .isEmpty()
      .withMessage("SplitValue should not be empty"),
    check("SplitInfo.*.SplitEntityId", "SplitEntityId should not be empty")
      .not()
      .isEmpty()
      .isAlphanumeric(),
    check("CustomerEmail")
      .normalizeEmail()
      .isEmail()
      .withMessage("Enter valid email address"),
  ],
  compute
);

exports.router = router;
