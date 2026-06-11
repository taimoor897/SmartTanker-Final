const TankLevel = require("../models/tankLevelModel");

// POST handler - receives data from Arduino
exports.receiveTankLevel = async (req, res) => {
  try {
    const { level, deviceId } = req.body;
    if (typeof level !== "number") {
      return res.status(400).json({ message: "Invalid level" });
    }

    const record = await TankLevel.create({
      level,
      deviceId: deviceId || "default-tank",
      timestamp: new Date(),
    });

    console.log(`📡 Received Tank Level: ${record.level}%`);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error("❌ Error saving tank level:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET handler - latest level for UI
exports.getLatestTankLevel = async (req, res) => {
  try {
    const { deviceId } = req.query;
    const filter = deviceId ? { deviceId } : {};

    const latest = await TankLevel.findOne(filter).sort({ timestamp: -1 });
    if (!latest) return res.status(404).json({ message: "No data found" });

    res.status(200).json({ success: true, data: latest });
  } catch (err) {
    console.error("❌ Error fetching tank level:", err);
    res.status(500).json({ message: "Server error" });
  }
};
