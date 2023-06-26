const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URI, {dbName: process.env.DATABASE_NAME}).then(() => 
    console.log("Connected to mongodb !")
);