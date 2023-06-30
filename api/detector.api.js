const { ObjectId } = require("mongodb");
const { DetectorModel } = require("../models/detector.model");

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
        const { name, position, station } = req.body;
        if (!name || typeof name !== "string" || !position || typeof position !== "object" || (station && ObjectId.isValid(station))) throw new CustomError("Bad request", 400);

        const detector = new DetectorModel({ name, position, station });
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