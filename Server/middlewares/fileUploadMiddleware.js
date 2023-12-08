// middleware/fileUploadMiddleware.js
const fileUpload = require('express-fileupload');

module.exports = fileUpload({ createParentPath: true });
