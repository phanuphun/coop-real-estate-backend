const multer = require('multer')
const sharp = require('sharp')
const multerStorage = multer.memoryStorage();
const err_service = require('./err_service')
const fs = require('fs')
const path = require('path');

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

const uploadFiles = upload.array("files", 8);


const uploadImages = (req, res, next) => {
    uploadFiles(req, res, err => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return res.send("Too many files to upload.");
            }
        } else if (err) {
            return res.send(err);
        }
        console.log('upload images = > ',req.files);
        next();
    });
};
const resizeImagesProperty = async (req, res, next) => {
    console.log('resize Images => ',req.files);
    if (!req.files) return next();
    req.body.gallery = [];
    await Promise.all(
        req.files.map(async file => {
            const newFilename = Date.now() + Math.round(Math.random()*1000)+".jpg";
            await sharp(file.buffer)
            .resize(600, 450)
            .toFormat("jpeg")
            .jpeg({ quality: 100 })
            .toFile(`public/images/properties/${newFilename}`);
            req.body.gallery.push(newFilename);
            console.log('resize');
        })
    );
    next();
};
const resizeImagesAvatar = async (req, res, next) => {
    console.log('resize Images => ',req.files);
    if (!req.files) return next();
    req.body.gallery = [];
    await Promise.all(
        req.files.map(async file => {
            const newFilename = Date.now() + Math.round(Math.random()*1000)+".jpg";
            await sharp(file.buffer)
            .toFormat("jpeg")
            .jpeg({ quality: 50 })
            .toFile(`public/images/avatar/${newFilename}`);
            req.body.gallery.push(newFilename);
            console.log('resize');
        })
    );
    next();
};
const resizeImagesPayment = async (req, res, next) => {
    console.log('resize Images => ',req.files);
    if (!req.files) return next();
    req.body.gallery = [];
    await Promise.all(
        req.files.map(async file => {
            const newFilename = Date.now() + Math.round(Math.random()*1000)+".jpg";
            await sharp(file.buffer)
            .toFormat("jpeg")
            .jpeg({ quality: 50 })
            .toFile(`public/images/payment/${newFilename}`);
            req.body.gallery.push(newFilename);
            console.log('resize');
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
        console.log('get result');

    next();
};

function deleteImage(imageName){
    if(fs.existsSync(path.resolve('public/images/'+imageName))){
        fs.unlink(path.resolve('public/images/'+imageName),(err)=>{
            if(err) err_service.errorNotification(err,'delete image')
        })
    }

}

  module.exports = {
    uploadImages: uploadImages,
    resizeImagesProperty: resizeImagesProperty,
    resizeImagesAvatar:resizeImagesAvatar,
    resizeImagesPayment:resizeImagesPayment,
    getResult: getResult,
    deleteImage: deleteImage,
  };
