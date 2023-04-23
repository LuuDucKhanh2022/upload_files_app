const X06_letters = require("../models/x06_lettersModel");

//  get report
const getReport = async (req, res, next) => {
  try {
    let aggregate = [];
    const aggMatch = {
      $match: {
        docStatus: { $exists: true },
      }
    };

    if( req.query.startDate && req.query.endDate) {
        const startDate = req.query.startDate.split("/").reverse().join("-");
        const endDate = req.query.endDate.split("/").reverse().join("-");
        const createdAt =  {
            $gte: new Date(startDate),
            $lt: new Date(endDate),
          };
        aggMatch.$match = {...aggMatch.$match,createdAt };
    }

    const aggGroup = {
      $group: {
        _id: "$docStatus",
        month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    };

    const aggProject = {
      $project: {
        // month: "$_id.month",
        docStatus: "$_id",
        count: "$count",
        _id: 0
      },
    };

    const aggSort = {
      $sort: {
        // month: 1,
        docStatus: 1,
      },
    };

    aggregate = [...aggregate, aggMatch, aggGroup, aggProject, aggSort];

    const letters = await X06_letters.aggregate(aggregate);
    res.status(200).json({
      success: true,
      data: letters,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getReport }; 