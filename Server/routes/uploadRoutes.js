// routes/uploadRoutes.js
const express = require('express');
const uploadController = require('../controllers/uploadController'); // Update the path based on your folder structure

const router = express.Router();

router.get("/", (req, res) =>
{
    res.json({ message: 'looking good' });
});

router.post('/upload', uploadController.upload);

router.get('*', (req, res) =>
{
    res.send('404 page not found');
});

module.exports = router;
