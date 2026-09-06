import multer from "multer";
import path from "path";
import fs from "fs";


// ============================================
// UPLOAD DIRECTORY
// ============================================

const uploadDirectory =
  path.join(
    process.cwd(),
    "uploads",
    "students"
  );


// ============================================
// CREATE DIRECTORY IF NOT EXISTS
// ============================================

if (
  !fs.existsSync(
    uploadDirectory
  )
) {
  fs.mkdirSync(
    uploadDirectory,
    {
      recursive: true,
    }
  );
}


// ============================================
// STORAGE
// ============================================

const storage =
  multer.diskStorage({

    destination: (
      _req,
      _file,
      cb
    ) => {
      cb(
        null,
        uploadDirectory
      );
    },


    filename: (
      _req,
      file,
      cb
    ) => {

      const extension =
        path.extname(
          file.originalname
        ).toLowerCase();


      const uniqueName =
        `student-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${extension}`;


      cb(
        null,
        uniqueName
      );
    },

  });


// ============================================
// FILE FILTER
// ============================================

const fileFilter:
  multer.Options["fileFilter"] =
  (
    _req,
    file,
    cb
  ) => {

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];


    if (
      !allowedMimeTypes.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed"
        )
      );
    }


    cb(
      null,
      true
    );
  };


// ============================================
// MULTER
// ============================================

const studentPhotoUpload =
  multer({

    storage,

    fileFilter,

    limits: {
      fileSize:
        2 * 1024 * 1024,
    },

  });


export default studentPhotoUpload;