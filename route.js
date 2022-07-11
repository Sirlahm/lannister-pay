const express = require("express");

const { check } = require("express-validator");

const compute = require("./controller");
const router = express.Router();

router.post(
  "/compute",
  [
    check("ID").isNumeric().withMessage("ID must be numeric"),
    check("Amount", "Amount must be numeric and must be greater than 0").isNumeric().custom((val ) => val > 0),
    check("Currency", "Currency must be string and must not be empty").isString().not()
    .isEmpty(),

    check(
      "SplitInfo",
      "SplitInfo must be an array of entities : minimum of 1 entity and maximum 0f 20 entiies"
    )
      .isArray()
      .isLength({min: 1})
      .custom((item) => item.length <= 20 ),
    check(
      "SplitInfo.*.SplitType",
      "SplitType must not be empty and must be either FLAT, PERCENTAGE or RATIO"
    )
      .not()
      .isEmpty()
      .isIn(["FLAT", "PERCENTAGE", "RATIO"]),
    check(
      "SplitInfo.*.SplitValue",
      "SplitValue must not be empty and must be numeric"
    )
      .not()
      .isEmpty()
      .isNumeric(),
    check("SplitInfo.*.SplitEntityId", "SplitEntityId must not be empty")
      .not()
      .isEmpty(),
    check("CustomerEmail")
      .normalizeEmail()
      .isEmail()
      .withMessage("Enter valid email address"),
  ],
  compute
);

exports.router = router;
