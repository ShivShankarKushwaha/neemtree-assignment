const readExcelFile = require('read-excel-file/node');
const CandidateModel = require('../models/database_Schema');
const async = require('async');

function removeDuplicateEmailsAndReturnUniqueEntries(entries)
{
    const uniqueEmails = new Set();
    const uniqueEntries = [];

    entries.forEach(entry =>
    {
        const email = entry[1];
        console.log('Unique Email:', email);

        if (!uniqueEmails.has(email)) {
            uniqueEntries.push(entry);
            uniqueEmails.add(email);
        }
    });

    return uniqueEntries;
}

module.exports = {
    handleExcelUpload: async (req, res) =>
    {
        try {
            const uploadedFile = req.files.file[0];
            console.log('Uploaded File Mimetype:', uploadedFile.mimetype);

            if (!uploadedFile || !uploadedFile.mimetype.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                return res.status(400).send('Please upload a valid Excel file.');
            }

            const excelRows = await readExcelFile(uploadedFile.data);

            const nonEmptyRows = excelRows.filter(row => row.some(cell => cell !== null && cell !== ''));

            const uniqueDataEntries = removeDuplicateEmailsAndReturnUniqueEntries(nonEmptyRows);
            console.log('Unique Entries:', uniqueDataEntries);

            const validEntries = uniqueDataEntries.slice(1);

            await async.eachSeries(validEntries, async (row) =>
            {
                console.log('Candidate Mobile Number:', row[2]);

                const candidateData = {
                    'Name of the Candidate': row[0],
                    'Email': row[1],
                    'Mobile No.': row[2],
                    'Date of Birth': row[3],
                    'Work Experience': row[4],
                    'Resume Title': row[5],
                    'Current Location': row[6],
                    'Postal Address': row[7],
                    'Current Employer': row[8],
                    'Current Designation': row[9]
                };

                const existingCandidate = await CandidateModel.findOne({ 'Email': row[1] });
                console.log('Existing Candidate:', existingCandidate);

                if (!existingCandidate) {
                    const newCandidate = await CandidateModel.create(candidateData);
                    console.log('New Candidate Created:', newCandidate);
                }
            });

            res.status(200).json({ message: 'Excel data parsed successfully' });
        } catch (error) {
            console.error('Error processing Excel data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
