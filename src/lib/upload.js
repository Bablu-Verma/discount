import multer from "multer";

export const upload_ = multer({
  storage: multer.diskStorage({
    destination: "../../../public/uploads",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
