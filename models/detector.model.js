const { Schema } = require("mongoose");

const Detector = new Schema({
    position: {
        type: {
            x: { type: Number, required: true },
            y: { type: Number },
            z: { type: Number, required: true }
        }, required: true
    }
});

const DetectorModel = model("Detector", Detector, "detectors");

module.exports = { DetectorModel };