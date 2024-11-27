const mongoose = require('mongoose')
require('colors')

const connectdb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected ${con.connection.host}`.bgYellow);
    } catch (error) {
        console.log(`Error: ${error.message}`.bgRed);
        process.exit(1)
    }
}

module.exports = connectdb;
