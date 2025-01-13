import multer from "multer";

function getUploadMiddleware(options: UploadOptions) {
  const upload = multer({
    storage,
    limits: {
      fileSize: options.maxFileSize,
    },
    fileFilter: fileFilter(options.allowedTypes),
  });

  if (options.isSingle) {
    return upload.single(options.bodyKey ?? "file");
  }

  return upload.array(options.bodyKey ?? "files");
}

export default getUploadMiddleware;

type UploadOptions = {
  allowedTypes?: string[];
  maxFileSize?: number;
  isSingle?: boolean;
  bodyKey?: string;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter: (allowedTypes?: string[]) => multer.Options["fileFilter"] =
  (allowedTypes?: string[]) => (req, file, cb) => {
    if (!allowedTypes || allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."));
    }
  };

/*
  If we want to upload to cloud storage we can use multer-s3 as following:

  import AWS from "aws-sdk";
  import multer from "multer";
  import multerS3 from "multer-s3";

  // Configure AWS S3
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  // Create the S3 Multer storage
  const s3Storage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME || "my-bucket",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now().toString()}_${file.originalname}`);
    },
  });

  and use this s3Storage in getUploadMiddleware instead of diskStorage
*/
