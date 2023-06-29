const { Schema, model } = require("mongoose");

const Detector = new Schema({
    position: {
        type: {
            x: { type: Number, required: true },
            y: { type: Number },
            z: { type: Number, required: true }
        }, required: true
    },
    station: { type: Schema.Types.ObjectId, ref: "Station" }
});

const DetectorModel = model("Detector", Detector, "detectors");

module.exports = { DetectorModel };