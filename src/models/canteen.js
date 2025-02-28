const mongoose = require("mongoose");

const CanteenSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    menu: [
        {
            itemName: { type: String, required: true },
            price: { type: Number, required: true },
            availability: { type: Boolean, default: true },
        }
    ],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], // Orders received
});

module.exports = mongoose.model("Canteen", CanteenSchema);
