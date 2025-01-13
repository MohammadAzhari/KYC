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
