const { ObjectId } = require("mongodb");
const { TrainModel } = require("../models/train.model");
const CustomError = require("../services/util");

const router = require("express").Router();

const trainMiddleware = async (req, res, next) => {
    try {
        const { trainId } = req.params;
        if (!trainId || !ObjectId.isValid(trainId)) throw new CustomError("Bad request", 400);

        req.train = await TrainModel.findById(trainId);
        if (!req.train) throw new CustomError("Not found", 404);

        next();
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

// create train, get train, detect train, update train, arrived to station train

module.exports = router;