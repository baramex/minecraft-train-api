const { Schema, Types, model } = require("mongoose");

const trainsState = {
    WAREHOUSE: 0,
    STATION: 1,
    MOVING: 2,
    LOADING: 3,
    UNLOADING: 4,
    ERRORED: 5,
    DELAYED: 6
};

const trainSchema = new Schema({
    tag: { type: String, required: true, unique: true },
    line: { type: Types.ObjectId, ref: "Line" },
    stocks: { type: [{ type: Types.ObjectId, ref: "Stock" }], required: true },
    station: { type: Types.ObjectId, ref: "Station" },
    invertedDirection: { type: Boolean },
    lastDetector: { type: Types.ObjectId, ref: "Detector" },
    lastDetectorDate: { type: Date },
    speed: { type: Number },
    throttle: { type: Number },
    brake: { type: Number },
    state: { type: Number, required: true, enum: Object.values(trainsState), default: trainsState.WAREHOUSE },
});

const TrainModel = model("Train", trainSchema, "trains");

module.exports = { TrainModel };