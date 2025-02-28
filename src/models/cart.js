const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Canteen.menu" },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Cart", CartSchema);
