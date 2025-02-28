const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CanteenCustomerSchema = new mongoose.Schema(
  {
    uni_id: { type: String, required: true }, // Fixed naming
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ }, // Ensures valid email format
    password: { type: String, required: true },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ }, // Ensures a 10-digit phone number
    hostler: { type: String, required: true, enum: ["Hostler", "Dayscholar"] }, // Restricts values
    room_no: { type: String }, // Fixed naming to match the backend
    department: { type: String, required: true },
    budget: { type: Number, min: 0 }, // Changed to Number type
    tokens: { type: String, enum: ["Monthly", "Daily"] }, // Ensures valid values
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before saving
CanteenCustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.models.CanteenCustomer || mongoose.model("CanteenCustomer", CanteenCustomerSchema);
