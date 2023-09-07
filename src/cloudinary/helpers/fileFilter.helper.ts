export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const validExtensions = ['jpg', 'png', 'jpeg', 'gif'];
  const fileExtension = file.mimetype.split('/')[1];

  if (!file) throw callback(new Error('File is empty'), false);

  if (validExtensions.includes(fileExtension)) return callback(null, true);

  throw callback(null, false);
};
