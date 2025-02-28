const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    canteenId: { type: mongoose.Schema.Types.ObjectId, ref: "Canteen", required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Canteen.menu" },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Order", OrderSchema);
