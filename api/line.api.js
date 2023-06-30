const { ObjectId } = require("mongodb");
const { LineModel } = require("../models/line.model");
const CustomError = require("../services/util");

const router = require("express").Router();

const lineMiddleware = async (req, res, next) => {
    try {
        const { lineId } = req.params;
        if (!lineId || !ObjectId.isValid(lineId)) throw new CustomError("Bad request", 400);

        req.line = LineModel.findById(lineId);
        if (!req.line) throw new CustomError("Not found", 404);

        next();
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

router.post("/line", async (req, res) => {
    try {
        const { name, stations, detectors, schedule } = req.body;
        if (!name || typeof name !== "string" || (stations && !Array.isArray(stations)) || (detectors && !Array.isArray(detectors)) || (schedule && !Array.isArray(schedule))) throw new CustomError("Bad request", 400);

        const line = new LineModel({ name, stations, detectors, schedule });
        await line.save();

        res.status(201).json(line);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.get("/line/:lineId", lineMiddleware, (req, res) => {
    try {
        res.status(200).json(req.line);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.post("/line/:lineId", lineMiddleware, async (req, res) => {
    try {
        const { name, stations, detectors, schedule } = req.body;
        if ((name && typeof name !== "string") || (stations && !Array.isArray(stations)) || (detectors && !Array.isArray(detectors)) || (schedule && !Array.isArray(schedule))) throw new CustomError("Bad request", 400);

        if (name) req.line.name = name;
        if (stations) req.line.stations = stations;
        if (detectors) req.line.detectors = detectors;
        if (schedule) req.line.schedule = schedule;
        await req.line.save();

        res.status(200).json(req.line);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;