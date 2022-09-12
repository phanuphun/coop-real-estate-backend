const multer = require('multer')
const sharp = require('sharp')
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadFiles = upload.array("gallery", 8);

const uploadImages = (req, res, next) => {
    uploadFiles(req, res, err => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.send("Too many files to upload.");
        }
      } else if (err) {
        return res.send(err);
      }
      next();
    });
  };

const resizeImagesProperty = async (req, res, next) => {
    if (!req.files) return next();
    req.body.gallery = [];
    // console.log(req.files);
    await Promise.all(
      req.files.map(async file => {
        const newFilename = Date.now()+ Math.round(Math.random() * 1000) + ".jpg"; 
        await sharp(file.buffer)
          .resize(600, 450)
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`public/images/properties/${newFilename}`);
        req.body.gallery.push(newFilename);
      })
    );
    next();
  };
const resizeImagesAvatar = async (req, res, next) => {
    if (!req.files) return next();
    req.body.gallery = [];
    // console.log(req.files);
    await Promise.all(
      req.files.map(async file => {
        const newFilename = Date.now()+ Math.round(Math.random() * 1000) + ".jpg"; 
        await sharp(file.buffer)
          .resize(600, 450)
          .toFormat("jpeg")
          .jpeg({ quality: 50 })
          .toFile(`public/images/avatar/${newFilename}`);
        req.body.gallery.push(newFilename);
      })
    );
    next();
  };

const resizeImagesPayment = async (req, res, next) => {
    if (!req.files) return next();
    req.body.gallery = [];
    // console.log(req.files);
    await Promise.all(
      req.files.map(async file => {
        const newFilename = Date.now()+ Math.round(Math.random() * 1000) + ".jpg"; 
        await sharp(file.buffer)
          // .resize(400, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`public/images/payment/${newFilename}`);
        req.body.gallery.push(newFilename);
      })
    );
    next();
  };

  const getResult = async (req, res, next) => {
    if (!req.body.gallery) {
      return res.send(`You must select at least 1 image.`);
    }
    const images = req.body.gallery
      .map(image => "" + image + "")
      .join("");
    next();
  };


  module.exports = {
    uploadImages: uploadImages,
    resizeImagesProperty: resizeImagesProperty,
    resizeImagesAvatar: resizeImagesAvatar,
    resizeImagesPayment: resizeImagesPayment,
    getResult: getResult
  };