const X06_letters = require("../models/x06_lettersModel");

async function reportAggregate(filter = {}, group, skip, limit) {
  try {
    let project = {};
    let sort = {};
    for (const key in group) {
      project[key] = `$_id.${key}`;
      sort[key] = 1;
    }

    project["count"] = "$count";
    project["_id"] = 0;

    const aggregate = [
      { $match: filter },
      {
        $group: {
          _id: group,
          count: { $sum: 1 },
        },
      },
      { $project: project },
      { $sort: sort },
      { $skip: skip },
    ];
    if (limit > 0) aggregate.push({ $limit: limit });
    const report = await X06_letters.aggregate(aggregate);
    return report;
  } catch (err) {
    return { errorMessage: err.message };
  }
}

const getReport = async (req, res) => {
  const resultPerPage = 5;
  let skip = 0;
  let limit = resultPerPage > 0 ? resultPerPage : 0;
  try {
    let match = {
      docStatus: { $exists: true },
    };

    if (req.query.startDate && req.query.endDate) {
      const startDate = req.query.startDate.split("/").reverse().join("-");
      const endDate = req.query.endDate.split("/").reverse().join("-");
      const createdAt = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
      match = { ...match, createdAt };
    }
    const group = {
      month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
      docStatus: "$docStatus",
    };

    if (req.query.page && req.query.page > 1) {
      const currentPage = req.query.page;
      skip = resultPerPage * (currentPage - 1);
    }

    const result = await reportAggregate(match, group, skip, limit);
    
    if (!result.errorMessage) {
      res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.errorMessage,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
//  get report
// const getReport = async (req, res, next) => {
//   const resultPerPage = 0;
//   let skip = 0;
//   try {
//     const aggMatch = {
//       $match: {
//         docStatus: { $exists: true },
//       },
//     };

//     if (req.query.startDate && req.query.endDate) {
//       const startDate = req.query.startDate.split("/").reverse().join("-");
//       const endDate = req.query.endDate.split("/").reverse().join("-");
//       const createdAt = {
//         $gte: new Date(startDate),
//         $lt: new Date(endDate),
//       };
//       aggMatch.$match = { ...aggMatch.$match, createdAt };
//     }

//     const aggGroup = {
//       $group: {
//         _id: {
//           month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
//           docStatus: "$docStatus",
//         },
//         count: { $sum: 1 },
//       },
//     };

//     console.log(aggGroup);

//     const aggProject = {
//       $project: {
//         month: "$_id.month",
//         docStatus: "$_id.docStatus",
//         count: "$count",
//         _id: 0,
//       },
//     };

//     const aggSort = {
//       $sort: {
//         month: 1,
//         docStatus: 1,
//       },
//     };

//     if (req.query.page && req.query.page > 1) {
//       const currentPage = req.query.page;
//       skip = resultPerPage * (currentPage - 1);
//     }

//     const aggregate = [
//       aggMatch,
//       aggGroup,
//       aggProject,
//       aggSort,
//       { $skip: skip },
//     ];

//     if (resultPerPage > 0) {
//       aggregate.push({ $limit: resultPerPage });
//     }

//     const letters = await X06_letters.aggregate(aggregate);
//     res.status(200).json({
//       success: true,
//       data: letters,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

module.exports = { getReport };
