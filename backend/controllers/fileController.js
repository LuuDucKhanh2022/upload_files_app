const multer = require("multer");
const upload = require("../models/multerModel");
const File = require("../models/fileModel");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
// upload single file
const uploadSingle = asyncHandler(async (req, res, next) => {
  upload.single("myFile")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      let message;
      switch (err.code) {
        case "LIMIT_FIELD_VALUE":
          message = "field value name maximum 100 bytes";
          break;
        case "LIMIT_FILE_SIZE":
          message = "file size 10 MB is maximum";
          break;
        default:
          message = err.message;
          break;
      }
      res.status(400).json({
        success: false,
        message,
      });
      // throw new Error(err.message);
    } else if (req.fileValidationError) {
      res.status(400).json({
        success: false,
        message:
          "Only the following file formats are accepted: pdf|pptx|doc|docx|xlsx|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF",
      });
    } else {
      console.log(req.file);
      try {
        const newFile = await File.create({
          name: req.file.filename,
          type: req.file.originalname.split(".")[1],
        });
        res.status(200).json({
          success: true,
          message: "File created successfully!!",
          newFile,
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: err.message,
        });
        // throw new Error(err.message);
      }
      next();
    }
  });
});

// upload mutiple file
const uploadMutiple = asyncHandler(async (req, res) => {
  upload.fields([
    {
      name: "attach_file",
      maxCount: 2,
    },
  ])(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      let message;
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          message = "file size 10 MB is maximum";
          break;
        case "LIMIT_FILE_COUNT":
          message = "Two file is maximum";
          break;
        case "LIMIT_FIELD_VALUE":
          message = "field value name maximum 100 bytes";
          break;
        default:
          message = err.message;
          break;
      }
      res.status(400).json({
        success: false,
        message,
      });
      // throw new Error(err.message);
    } else if (req.fileValidationError) {
      res.status(400).json({
        success: false,
        fileNotValid: req.fileValidationError.filename,
        message:
          "Only the following file formats are accepted: pdf|pptx|doc|docx|xlsx|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF",
      });
    } else {
      var listFiles = [];
      try {
        req.files.attach_file.forEach(async function (item, index) {
          let file = new File({
            name: item.filename,
            type: item.filename.split(".")[1],
          });
          file.save();
          // let file = await File.create({
          //   name: item.filename,
          //   type: item.filename.split(".")[1],
          // });
          listFiles.push(file);
        });
        res.status(200).json({
          success: true,
          message: "upload files successfully",
          listFiles,
        });
      } catch (err) {
        res.status(400).json({
          success: false,
          message: err.message,
          listFiles,
        });
      }
    }
  });
});

// get files
const getFiles = asyncHandler(async (req, res) => {
  try {
    let files;
    if (req.query.type) {
      files = await File.find({ type: req.query.type });
    } else {
      files = await File.find();
    }
    if (files.length > 0) {
      res.status(200).json({
        success: true,
        files,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "Can not find any files",
      });
    }
  } catch (err) {
    res.json({
      status: false,
      message: err.message,
    });
  }
});

// get single file
const getSingleFile = asyncHandler(async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    res.status(200).json({
      success: true,
      file,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Not found any file with this id",
    });
  }
});

module.exports = { uploadSingle, uploadMutiple, getFiles, getSingleFile };
