const { ObjectId } = require("mongodb");
const { DetectorModel } = require("../models/detector.model");
const CustomError = require("../services/util");

const router = require("express").Router();

const detectorMiddleware = async (req, res, next) => {
    try {
        const { detectorId } = req.params;
        if (!detectorId || !ObjectId.isValid(detectorId)) throw new CustomError("Bad request", 400);

        req.detector = await DetectorModel.findById(detectorId);
        if (!req.detector) throw new CustomError("Not found", 404);

        next();
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

// TODO: find by position ? or can put tag to detector ?

router.post("/detector", async (req, res) => {
    try {
        const { direction, position, station } = req.body;
        if (!direction || typeof direction !== "string" || !position || typeof position !== "object" || (station && !ObjectId.isValid(station))) throw new CustomError("Bad request", 400);

        const detector = new DetectorModel({ direction, position, station });
        await detector.save();

        res.status(201).json(detector);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.get("/detector/:detectorId", detectorMiddleware, (req, res) => {
    try {
        res.status(200).json(req.detector);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.post("/detector/:detectorId", detectorMiddleware, async (req, res) => {
    try {
        const { direction, position, station } = req.body;
        if ((direction && typeof direction !== "string") || (position && typeof position !== "object") || (station && !ObjectId.isValid(station))) throw new CustomError("Bad request", 400);

        if (direction) req.detector.direction = direction;
        if (position) req.detector.position = position;
        if (station) req.detector.station = station;
        await req.detector.save();

        res.status(200).json(req.detector);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;