const { ObjectId } = require('mongodb');
const { UserModel } = require('../models/user.model');
const CustomError = require('../services/util');

const router = require('express').Router();

const userMiddleware = async (req, res, next) => {
    try {
        const { cardId } = req.params;
        if (!cardId || typeof cardId !== "string") throw new CustomError("Bad request", 400);

        req.user = await UserModel.findOne({ cardId });
        if (!req.user) throw new CustomError("Not found", 404);

        next();
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

router.post("/user", async (req, res) => {
    try {
        const { cardId } = req.body;
        if (!cardId || typeof cardId !== "string") throw new CustomError("Bad request", 400);

        const user = new UserModel({ cardId });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.get("/user/:cardId", userMiddleware, (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.post("/user/:cardId/use", userMiddleware, async (req, res) => {
    try {
        const { station } = req.body;
        if (!station || !ObjectId.isValid(station)) throw new CustomError("Bad request", 400);

        const usage = req.user.remainingUsages.splice(0, 1)?.[0];
        if (!usage) throw new CustomError("No remaining usages", 400);

        req.user.usages.push({ ...usage, station });
        await req.user.save();

        res.status(200).json(req.user);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.post("/user/:cardId/purchase", userMiddleware, async (req, res) => {
    try {
        const { count } = req.body;
        if (!count || typeof count !== "number") throw new CustomError("Bad request", 400);

        const usages = new Array(count).fill({});
        req.user.remainingUsages.push(...usages);
        await req.user.save();

        res.status(200).json(req.user);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;