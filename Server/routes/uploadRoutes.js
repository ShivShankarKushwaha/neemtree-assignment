const express = require('express');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

router.get("/", (req, res) =>
{
    res.json({ message: 'looking good' });
});

router.post('/upload', uploadController.handleExcelUpload);

router.get('*', (req, res) =>
{
    res.send('404 page not found');
});

module.exports = router;
