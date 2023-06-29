const { Schema, model } = require("mongoose");

const stationSchema = new Schema({
    name: { type: String, required: true, unique: true },
    position: {
        type: {
            x: { type: Number, required: true },
            y: { type: Number },
            z: { type: Number, required: true }
        }, required: true
    }
});

const StationModel = model("Station", stationSchema, "stations");

module.exports = { StationModel };