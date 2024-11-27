const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectdb = require('./config/Config');
const itemModel = require('./models/ItemModel');
const items = require('./utils/Data');

dotenv.config();
connectdb();

const importData = async () => {
    try {
        await itemModel.deleteMany();
        const itemData = await itemModel.insertMany(items);
        console.log('All Items Added'.bgGreen);
        process.exit();
    } catch (error) {
        console.log(`${error}`.bgRed.inverse);
        process.exit(1);
    }
};

importData();