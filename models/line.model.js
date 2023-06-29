const { Schema, Types, model } = require("mongoose");

const lineSchema = new Schema({
    name: { type: String, required: true, unique: true },
    stations: { type: [{ station: { type: Types.ObjectId, ref: "Station", required: true }, track: String, time: { type: Number, required: true } }], required: true, default: [] },
    detectors: { type: [{ type: Types.ObjectId, ref: "Detector" }], required: true, default: [] },
    schedule: {
        type: [
            {
                startTime: { type: Number, required: true },
                endTime: { type: Number, required: true },
                reversed: { type: Boolean, required: true },
            }
        ], required: true, default: []
    }
});

const LineModel = model("Line", lineSchema, "lines");

module.exports = { LineModel };