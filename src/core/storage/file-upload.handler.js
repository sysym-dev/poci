const multer = require('multer');
const path = require('path');
const { storageConfig } = require('./storage.config');
const { FileUploadException } = require('./file-upload.exception');

exports.createFileUploadHanlder = function (field, options) {
  const destination = path.join(
    storageConfig.uploadPath,
    options.directory,
    field,
  );
  const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
      const uploadedName = `${field}-${Date.now()}${path.extname(
        file.originalname,
      )}`;

      file.uploadedName = uploadedName;
      file.uploadedPath = path.join(destination, uploadedName);

      cb(null, uploadedName);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (!options.mimetypes.includes(file.mimetype)) {
      cb(
        new FileUploadException(field, `${field} is has invalid mimetype`),
        false,
      );
    } else {
      cb(null, true);
    }
  };

  const uploader = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: options.limit,
    },
  });

  return (req, res, next) => {
    const upload = uploader.single(field);

    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return next(new FileUploadException(field, err.message));
        }

        return next(err);
      }

      if (!req.file) {
        return next(new FileUploadException(field, `${field} is required`));
      }

      next();
    });
  };
};
