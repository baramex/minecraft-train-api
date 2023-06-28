const { Schema } = require("mongoose");

const stationSchema = new Schema({
    name: { type: String, required: true, unique: true },
    position: {
        type: {
            x: { type: Number, required: true },
            y: { type: Number },
            z: { type: Number, required: true }
        }, required: true
    },
    lines: { type: [{ type: Schema.Types.ObjectId, ref: "Line" }], required: true, default: [] },
});

const StationModel = model("Station", stationSchema, "stations");

module.exports = { StationModel };