require('dotenv').config();
module.exports = {
    port: process.env.PORT || 5500,
    mongo_link: process.env.MONGO_LINK,
};
