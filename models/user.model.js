const { Schema, Types, model } = require("mongoose");

const userSchema = new Schema({
    uuid: String,
    cardId: { type: String, required: true, unique: true },
    usages: {
        type: [{
            station: { type: Types.ObjectId, ref: "Station", required: true },
            purchaseDate: { type: Date, required: true },
            date: { type: Date, default: Date.now, required: true }
        }], required: true, default: []
    },
    remainingUsages: {
        type: [{
            purchaseDate: { type: Date, default: Date.now, required: true }
        }], required: true, default: []
    }
});

const UserModel = model("User", userSchema, "users");

module.exports = { UserModel };