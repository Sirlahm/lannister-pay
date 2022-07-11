const { validationResult } = require("express-validator");

const compute = (req, res, next) => {
  const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg });
  }

  // Initializing Balance
  let balance = Number(Amount);
  let total = 0;

  // Arrays for each splitType
  const flatTypes = [];
  const percentageTypes = [];
  const ratioTypes = [];

  SplitInfo.forEach((info, index) => {
    switch (info.SplitType) {
      case "FLAT":
        flatTypes.push({ ...info, index });
        break;
      case "PERCENTAGE":
        percentageTypes.push({ ...info, index });
        break;
      case "RATIO":
        total += Number(info.SplitValue);
        ratioTypes.push({ ...info, index });
        break;
      default:
        break;
    }
  });

  //Arrange in order of precedence for Split Type
  const allSplitTypes = [...flatTypes, ...percentageTypes, ...ratioTypes];

  const finalSplitBreakDown = [];
  let ratioBalance;

  //Calculation of Split amount for each object in arranged SplitInfo array
  allSplitTypes.forEach((currentSplitInfo) => {
    if (currentSplitInfo.SplitType === "FLAT") {
      const resObj = {};

      balance -= Number(currentSplitInfo.SplitValue);
      resObj["SplitEntityId"] = currentSplitInfo.SplitEntityId;
      resObj["Amount"] = currentSplitInfo.SplitValue;
      finalSplitBreakDown.push(resObj);
    } else if (currentSplitInfo.SplitType === "PERCENTAGE") {
      const resObj = {};

      const percentageSplitAmount =
        (Number(currentSplitInfo.SplitValue) / 100) * balance;
      balance -= Number(percentageSplitAmount);
      resObj["SplitEntityId"] = currentSplitInfo.SplitEntityId;
      resObj["Amount"] = percentageSplitAmount;
      finalSplitBreakDown.push(resObj);
      ratioBalance = balance;
    } else if (currentSplitInfo.SplitType === "RATIO") {
      const resObj = {};

      const openingRatioBalance = ratioBalance;
      const ratioSplitAmount =
        (Number(currentSplitInfo.SplitValue) / total) * openingRatioBalance;
      balance -= Number(ratioSplitAmount);
      resObj["SplitEntityId"] = currentSplitInfo.SplitEntityId;
      resObj["Amount"] = ratioSplitAmount;
      finalSplitBreakDown.push(resObj);
    }
  });

  res.status(200).json({
    ID,
    Balance: balance,
    SplitBreakdown: finalSplitBreakDown,
  });
};

module.exports = compute;
