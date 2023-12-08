// controller/uploadController.js
const readXlsxFile = require('read-excel-file/node');
const ExcelData = require('../models/database'); // Update the path based on your folder structure
const async = require('async');
function findUniqueObjects(arr)
{
    const uniqueObjects = new Set();
    const newarr = [];
    arr.forEach(obj =>
    {
        const  Email  = obj[1];
        console.log('Email', Email);
        if (!uniqueObjects.has(Email)) {
            newarr.push(obj);
            uniqueObjects.add(Email);
        }
    });

    return newarr;
}
module.exports = {
    upload: async (req, res) =>
    {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let uploadedFile = req.files.file[0];
        console.log('mimetype', uploadedFile.mimetype);

        if (uploadedFile.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && uploadedFile.mimetype !== 'application/vnd.ms-excel') {
            return res.status(400).send('Please upload an Excel file.');
        }

        const rows = await readXlsxFile(uploadedFile.data);
        // finding non empty rows
        const nonEmptyData = rows.filter(row => row.some(cell => cell !== null && cell !== ''));
        // finding unique rows
        const uniquedata = findUniqueObjects(nonEmptyData);
        console.log('uniquedata', uniquedata);
        console.log('array rendering');
        const alldata = [];
        // removing header row
        const validdata = uniquedata.slice(1);
        await async.eachSeries(validdata, async (row) =>
        {
            const mobileNumber = Number(row[2]);
            console.log('mobileNumber', mobileNumber, row[2]);
            const data = {
                'Name of the Candidate': row[0],
                'Email': row[1],
                'Mobile No.': mobileNumber || null,
                'Date of Birth': row[3],
                'Work Experience': row[4],
                'Resume Title': row[5],
                'Current Location': row[6],
                'Postal Address': row[7],
                'Current Employer': row[8],
                'Current Designation': row[9]
            };

            let checkalready = await ExcelData.findOne({ 'Email': row[1] });
            console.log('checkalready', checkalready);
            if (!checkalready) {
                alldata.push(data);
            }
        });

        // console.log('alldata', alldata);
        let filldata = await ExcelData.insertMany(alldata);
        console.log('filldata', filldata);
        res.status(200).json({ message: 'Excel data parsed successfully' });

    }
};




