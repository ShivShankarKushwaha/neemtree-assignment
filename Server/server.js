const express = require('express');
const config = require('./config/config');
const fileUploadMiddleware = require('./middlewares/fileUploadMiddleware');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUploadMiddleware);

// if (process.env.NODE_ENV === 'production') 
{
    app.use(express.static(__dirname + '/build'));
}


app.use('/', uploadRoutes);

app.get('*',(req,res)=>
{
    if (process.env.NODE_ENV === 'production') {
        return res.sendFile(__dirname + '/build/index.html');
    }
    res.send('404, page not found');
})
app.listen(config.port, () =>
{
    console.log(`server is running on http://localhost:${config.port}`);
});
