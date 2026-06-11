const mongoose = require("mongoose");

const tankLevelSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
  },
  deviceId: {
    type: String,
    default: "default-tank",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TankLevel", tankLevelSchema);
