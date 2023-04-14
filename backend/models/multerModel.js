var multer = require("multer");
const path = require("path");
// multer
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".")[1];
    cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

// Multer limit
const limits = {
  fieldNameSize: 100, // 100 byte
  fileSize: 1024 * 1024 * 10, // Giới hạn tối đa là 10MB
  files: 2,
};
// Multer Filter
const fileFilter = (req, file, cb) => {
  // let typeFile = [".pdf", ".pptx", ".docx", ".plain", ".xlsx"];
  if (
    file.originalname.match(
      /\.(pdf|pptx|doc|docx|xlsx|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/
    )
    // file.originalname.endsWith(
    //   ".pdf" || ".pptx" || ".docx" || ".txt" || ".xlsx"
    // )
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = {
      filename: file.originalname,
      message: "Forbidden extension",
    };
    cb(null, false, req.fileValidationError);
  }
};

//Calling the "multer" Function
const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
