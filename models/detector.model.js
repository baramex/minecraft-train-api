const { Schema, model } = require("mongoose");

const directions = {
    EAST: "east",
    WEST: "west",
    NORTH: "north",
    SOUTH: "south"
};

const Detector = new Schema({
    position: {
        type: {
            x: { type: Number, required: true },
            y: { type: Number },
            z: { type: Number, required: true }
        }, required: true
    },
    station: { type: Schema.Types.ObjectId, ref: "Station" },
    direction: { type: String, required: true, enum: Object.values(directions) },
});

const DetectorModel = model("Detector", Detector, "detectors");

module.exports = { DetectorModel };