// models/database.js
const mongoose = require('mongoose');
const config = require('../config/config');
mongoose.connect(config.mongo_link).then(console.log('database connected')).catch((err) => console.log('database err', err))
const schema = new mongoose.Schema({
    'Name of the Candidate': String,
    'Email': {
        type: String,
        unique: true
    },
    'Mobile No.': Number,
    'Date of Birth': Object,
    'Work Experience': String,
    'Resume Title': String,
    'Current Location': String,
    'Postal Address': String,
    'Current Employer': String,
    'Current Designation': String
})

const data = mongoose.model('data', schema);
module.exports = data;