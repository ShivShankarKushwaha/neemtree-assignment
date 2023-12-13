const express = require('express');
const serverConfig = require('./config/config');
const uploadMiddleware = require('./middlewares/fileUploadMiddleware');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(uploadMiddleware);

// Serve static files in production
if (isProductionEnvironment()) app.use(express.static(buildDirectoryPath()));

// Routes
app.use('/', uploadRoutes);

// Catch-all route for 404
app.get('*', (req, res) =>
{
    isProductionEnvironment()
        ? res.sendFile(buildIndexFilePath())
        : res.status(404).send('404, page not found');
});

// Start server
app.listen(serverConfig.port, () =>
{
    console.log(serverStartMessage());
});

// Functions
function isProductionEnvironment()
{
    return process.env.NODE_ENV === 'production';
}

function buildDirectoryPath()
{
    return __dirname + '/build';
}

function buildIndexFilePath()
{
    return __dirname + '/build/index.html';
}

function serverStartMessage()
{
    return `Server is running on http://localhost:${serverConfig.port}`;
}
