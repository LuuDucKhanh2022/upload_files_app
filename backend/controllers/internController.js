const asyncHandler = require("express-async-handler");
const Intern = require("../models/internModel");
const createIntern = asyncHandler (async (req, res)=> {
  const { name , age} = req.body;
  try {
    const newIntern = await Intern.create({name, age});
    res.status(201).json({
      success:true,
      data: newIntern
    })
  } catch(error) {
    res.status(424);
    throw new Error (error.message);
  }
})

const fetchInterns =  asyncHandler (async (req, res) => {
  try {
    const interns = await Intern.find();
    res.status(200).json({
      success: true,
      data: interns
    })
  } catch(error) {
    res.status(500);
    throw new Error( error.message);
  }
})

module.exports = { createIntern, fetchInterns };
