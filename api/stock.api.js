const { ObjectId } = require("mongodb");
const { StockModel } = require("../models/stock.model");
const CustomError = require("../services/util");
const { TrainModel } = require("../models/train.model");

const router = require("express").Router();

const stockMiddleware = async (req, res, next) => {
    try {
        const { tag } = req.params;
        if (!tag || typeof tag !== "string") throw new CustomError("Bad request", 400);

        req.stock = await StockModel.findOne({ tag });
        if (!req.stock) throw new CustomError("Not found", 404);

        next();
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
};

router.post("/stock", async (req, res) => {
    try {
        const { tag, type, shipment } = req.body;
        if (!tag || typeof tag !== "string" || typeof type !== "number" || (shipment && !Array.isArray(shipment))) throw new CustomError("Bad request", 400);

        const stock = new StockModel({ tag, type, shipment });
        await stock.save();

        res.status(201).json(stock);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.get("/stock/:tag", stockMiddleware, (req, res) => {
    try {
        res.status(200).json(req.stock);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.get("/stock/:tag/shipment", stockMiddleware, (req, res) => {
    try {
        res.status(200).json(req.stock.shipment);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.put("/stock/:tag/shipment", stockMiddleware, async (req, res) => {
    try {
        const { type, name, quantity, maxQuantity, destination } = req.body;
        if (typeof type !== "number" || !name || typeof name !== "string" || typeof quantity !== "number" || (maxQuantity && typeof maxQuantity !== "number") || !destination || !ObjectId.isValid(destination)) throw new CustomError("Bad request", 400);

        req.stock.shipment.push({ type, name, quantity, maxQuantity, destination });
        await req.stock.save();

        res.status(200).json(req.stock);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.put("/stock/:tag/shipment/:id", stockMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !ObjectId.isValid(id)) throw new CustomError("Bad request", 400);

        const shipment = req.stock.shipment.find(s => id.isEquals(s._id));
        if (!shipment) throw new CustomError("Not found", 404);

        const { type, name, quantity, maxQuantity, destination } = req.body;
        if ((type !== undefined && typeof type !== "number") || (quantity !== undefined && typeof quantity !== "number") || (maxQuantity && typeof maxQuantity !== "number") || (name && typeof name !== "string") || (destination && !ObjectId.isValid(destination))) throw new CustomError("Bad request", 400);

        if (type !== undefined) shipment.type = type;
        if (name) shipment.name = name;
        if (quantity !== undefined) shipment.quantity = quantity;
        if (maxQuantity) shipment.maxQuantity = maxQuantity;
        if (destination) shipment.destination = destination;
        await req.stock.save();

        res.status(200).json(req.stock);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.delete("/stock/:tag/shipment/:id", stockMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !ObjectId.isValid(id)) throw new CustomError("Bad request", 400);

        const shipment = req.stock.shipment.find(s => id.isEquals(s._id));
        if (!shipment) throw new CustomError("Not found", 404);

        req.stock.shipment = req.stock.shipment.filter(s => !id.isEquals(s._id));
        await req.stock.save();

        res.status(200).json(req.stock);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.get("/stock/:tag/shipment/:id", stockMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !ObjectId.isValid(id)) throw new CustomError("Bad request", 400);

        const shipment = req.stock.shipment.find(s => id.isEquals(s._id));
        if (!shipment) throw new CustomError("Not found", 404);

        res.status(200).json(shipment);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

router.get("/stock/:tag/train", stockMiddleware, async (req, res) => {
    try {
        const train = await TrainModel.findOne({ stocks: { $all: [req.stock._id] } });
        if (!train) throw new CustomError("Not found", 404);

        res.status(200).json(train);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
});

module.exports = router;