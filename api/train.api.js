const { ObjectId } = require("mongodb");
const { TrainModel } = require("../models/train.model");
const CustomError = require("../services/util");
const { DetectorModel } = require("../models/detector.model");

const router = require("express").Router();

const trainMiddleware = async (req, res, next) => {
    try {
        const { tag } = req.params;
        if (!tag || typeof tag !== "string") throw new CustomError("Bad request", 400);

        req.train = await TrainModel.findOne({ tag });
        if (!req.train) throw new CustomError("Not found", 404);

        next();
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

router.post("/train", async (req, res) => {
    try {
        const { line, stocks } = req.body;
        if (!Array.isArray(stocks) || (line && !ObjectId.isValid(line))) throw new CustomError("Bad request", 400);

        const train = await TrainModel.create({ line, stocks });
        await train.save();

        res.status(201).json(train);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.get("/train/:tag", trainMiddleware, (req, res) => {
    try {
        res.status(200).json(req.train);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.post("/train/:tag/detect", trainMiddleware, async (req, res) => {
    try {
        const { detector: detectorId, speed, throttle, brake, direction } = req.body;
        if (!detectorId || !ObjectId.isValid(detectorId) || typeof speed !== "number" || typeof throttle !== "number" || typeof brake !== "number" || typeof direction !== "string") throw new CustomError("Bad request", 400);

        const detector = await DetectorModel.findById(detectorId);
        if (!detector) throw new CustomError("Not found", 404);

        if (detector.station) req.train.station = detector.station;
        else req.train.station = undefined;

        req.train.lastDetector = detectorId;
        req.train.lastDetectorDate = new Date();
        req.train.speed = speed;
        req.train.throttle = throttle;
        req.train.brake = brake;
        req.train.invertedDirection = direction !== detector.direction;
        await req.train.save();

        res.status(200).json(req.train);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.post("/train/:tag", trainMiddleware, async (req, res) => {
    try {
        const { line, stocks, state } = req.body;

        if (line && !ObjectId.isValid(line)) throw new CustomError("Bad request", 400);
        if (stocks && !Array.isArray(stocks)) throw new CustomError("Bad request", 400);
        if (state && typeof state !== "number") throw new CustomError("Bad request", 400);

        if (line) req.train.line = line;
        if (stocks) req.train.stocks = stocks;
        if (state) req.train.state = state;
        await req.train.save();

        res.status(200).json(req.train);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;