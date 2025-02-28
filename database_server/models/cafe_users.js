const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uni_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
  password: { type: String, required: true },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  hostler: { type: String, required: true, enum: ["Hostler", "Dayscholar"] },
  room_no: { type: String },
  department: { type: String, required: true },
  budget: { type: Number, min: 0 },
  tokens: { type: String, enum: ["Monthly", "Daily"] },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("cafe_users", UserSchema);
