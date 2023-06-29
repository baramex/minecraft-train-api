const { Schema, Types, model } = require("mongoose");

const stocksType = {
    PASSENGER: 0,
    ITEM: 1,
    FLUID: 2,
    LOCOMOTIVE: 3
};

const shipmentsType = {
    PASSENGER: 0,
    ITEM: 1,
    FLUID: 2
};

const stockSchema = new Schema({
    tag: { type: String, required: true, unique: true },
    type: { type: Number, required: true, enum: Object.values(stocksType) },
    shipment: {
        type: [{
            type: { type: Number, required: true, enum: Object.values(shipmentsType) },
            name: { type: String },
            quantity: { type: Number, required: true },
            destination: { type: Types.ObjectId, ref: "Station" }
        }], required: true, default: []
    },
});

const StockModel = model("Stock", stockSchema, "stocks");

module.exports = { StockModel };