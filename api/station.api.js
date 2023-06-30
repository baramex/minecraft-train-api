const { ObjectId } = require("mongodb");
const { StationModel } = require("../models/station.model");
const CustomError = require("../services/util");

const router = require("express").Router();

const stationMiddleware = async (req, res, next) => {
    try {
        const { stationId } = req.params;
        if (!stationId || !ObjectId.isValid(stationId)) throw new CustomError("Bad request", 400);

        req.station = StationModel.findById(stationId);
        if (!req.station) throw new CustomError("Not found", 404);

        next();
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

router.post("/station", async (req, res) => {
    try {
        const { name, position } = req.body;
        if (!name || typeof name !== "string" || !position || typeof position !== "object") throw new CustomError("Bad request", 400);

        const station = new StationModel({ name, position });
        await station.save();

        res.status(201).json(station);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.get("/station/:stationId", stationMiddleware, (req, res) => {
    try {
        res.status(200).json(req.station);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.post("/station/:stationId", stationMiddleware, async (req, res) => {
    try {
        const { name, position } = req.body;
        if ((name && typeof name !== "string") || (position && typeof position !== "object")) throw new CustomError("Bad request", 400);

        if (name) req.station.name = name;
        if (position) req.station.position = position;
        await req.station.save();

        res.status(200).json(req.station);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;