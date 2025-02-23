const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./public"; 
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); 
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

function uploadMiddleware(req, res, next) {
  const uploadSingle = upload.single("image");

  uploadSingle(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Image is optional, so do not return an error if it's missing
    req.body.imagePath = req.file ? req.file.path : null;
    next();
  });
}

module.exports = uploadMiddleware;
