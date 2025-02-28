const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CanteenCustomerSchema = new mongoose.Schema(
  {
    uniId: { type: String, required: true, unique: true }, // University ID
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    phone: { type: String, required: true },
    hostler: { type: String, required: true, enum: ["Hostler", "Dayscholar"] },
    roomNumber: { type: String, required: function () { return this.hostler === "Hostler"; } },
    department: { type: String, required: true },
    budget: { type: Number },
    tokens: { type: String, required: true, enum: ["Monthly", "Daily"] },
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
