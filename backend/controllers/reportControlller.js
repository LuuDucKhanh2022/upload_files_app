const X06_letters = require("../models/x06_lettersModel");
const moment = require("moment");

// get Array of time by type
function getTime(startDate = '01/01/2023', endDate = '30/04/2023', type = 'month') {
  startDate = moment(startDate, 'DD/MM/YYYY');
  endDate = moment(endDate, 'DD/MM/YYYY');
  console.log(startDate);
  console.log(endDate);
  let startOfPeriod = startDate
  let result = [];

  while (startOfPeriod.isBefore(endDate)) {
    let newStartOfPeriod = moment(startOfPeriod).add(1, type).startOf(type);
    let currentNo = startOfPeriod.get(type);
    result.push({
      time: type !== "month" ? currentNo : currentNo += 1,
      startDate: startOfPeriod.format('DD/MM/YYYY'),
      endDate: startOfPeriod.endOf(type).format('DD/MM/YYYY'),
    })
    startOfPeriod = newStartOfPeriod;
  }
  return result;
}

async function reportAggregate(startDate, endDate) {
  try {
    const aggMatch = {
      $match: {
        docStatus: { $exists: true },
        createdAt: { $gte: new Date(startDate.split("/").reverse().join("-")), $lt: new Date(endDate.split("/").reverse().join("-")) }
      }
    }

    const aggGroup = {
      $group: {
        _id: "$docStatus",
        count: { $sum: 1 }
      }
    }

    const aggProject = {
      $project: {
        docStatus: "$_id",
        count: "$count",
        _id: 0
      }
    }

    const aggSort = {
      $sort: {
        docStatus: 1
      }
    }

    const aggregate = [aggMatch, aggGroup, aggProject, aggSort];
    const result = await X06_letters.aggregate(aggregate);
    return result

  } catch (err) {
    return { errorMessage: err.message };
  }
}

const getReport = async (req, res) => {
  try {
    let arrOfTime = getTime(req.query.startDate, req.query.endDate, req.query.type);
    //test reportAggregate
    // const newArrOfTime = await reportAggregate(req.query.startDate,req.query.endDate);
    let result = [];
     arrOfTime =  arrOfTime.forEach(async (item,index) => {
      let data = await reportAggregate(item.startDate, item.endDate);
      item["data"]= data;
      console.log(item);

      // result.push(item);
    })

    res.status(200).json({
      success: true,
      data: arrOfTime
    })
  } catch (err) {
    res.status(500).json({
      sucess: false,
      message: err.message
    })
  }
  
}

// async function reportAggregate(filter = {}, group, skip, limit) {
//   try {
//     let project = {};
//     let sort = {};
//     for (const key in group) {
//       project[key] = `$_id.${key}`;
//       sort[key] = 1;
//     }

//     project["count"] = "$count";
//     project["_id"] = 0;

//     const aggregate = [
//       { $match: filter },
//       {
//         $group: {
//           _id: group,
//           count: { $sum: 1 },
//         },
//       },
//       { $project: project },
//       { $sort: sort },
//       { $skip: skip },
//     ];
//     if (limit > 0) aggregate.push({ $limit: limit });
//     const report = await X06_letters.aggregate(aggregate);
//     return report;
//   } catch (err) {
//     return { errorMessage: err.message };
//   }
// }

// const getReport = async (req, res) => {
//   const resultPerPage = 5;
//   let skip = 0;
//   let limit = resultPerPage > 0 ? resultPerPage : 0;
//   try {
//     let match = {
//       docStatus: { $exists: true },
//     };

//     if (req.query.startDate && req.query.endDate) {
//       const startDate = req.query.startDate.split("/").reverse().join("-");
//       const endDate = req.query.endDate.split("/").reverse().join("-");
//       const createdAt = {
//         $gte: new Date(startDate),
//         $lt: new Date(endDate),
//       };
//       match = { ...match, createdAt };
//     }
//     const group = {
//       month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
//       docStatus: "$docStatus",
//     };

//     if (req.query.page && req.query.page > 1) {
//       const currentPage = req.query.page;
//       skip = resultPerPage * (currentPage - 1);
//     }

//     const result = await reportAggregate(match, group, skip, limit);

//     if (!result.errorMessage) {
//       res.status(200).json({
//         success: true,
//         data: result,
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: result.errorMessage,
//       });
//     }
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };




module.exports = { getReport };
