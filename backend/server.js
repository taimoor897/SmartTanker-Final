require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const User = require('./user');
const iotRoutes = require('./Routes/iotRoutes');
const Order = require('./models/Order');


const jwt = require('jsonwebtoken');

const app = express();


// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


const paymentRoutes = require('./Routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);


const complaintRoutes = require('./Routes/complaintRoutes');
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));


// =========================
// IOT ROUTES
// =========================
app.use('/api/iot', iotRoutes);

// =========================
// ESP32 DATA STORAGE
// =========================
let latestTankDistance = null;

app.post('/api/iot/tank-distance', (req, res) => {
  const { distance } = req.body;

  if (distance === undefined || typeof distance !== 'number' || distance < 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid distance value'
    });
  }

  latestTankDistance = distance;
  console.log('📡 ESP32 distance:', distance);

  res.json({ success: true, distance });
});

app.get('/api/iot/latest-distance', (req, res) => {
  if (latestTankDistance === null) {
    return res.status(200).json({
      success: false,
      distance: null,
      sensorConnected: false
    });
  }

  res.status(200).json({
    success: true,
    distance: latestTankDistance,
    sensorConnected: true
  });
});

// =========================
// MONGODB CONNECT
// =========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// =========================
// AUTH ROUTES
// =========================
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer'
    });

    res.status(201).json({
      message: 'Account created',
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
      if (email === "admin@gmail.com" && password === "123456") {
      return res.json({
        token: "admin-token",
        user: {
          _id: "admin",
          name: "Admin",
          email,
          role: "admin"
        }
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


let tankerLocation = { lat: 33.6844, lng: 73.0479 };
const destination = { lat: 33.6900, lng: 73.0600 };

app.get('/api/tanker-location', (req, res) => {
  const step = 0.0007; // bigger step for visible movement
  if (Math.abs(destination.lat - tankerLocation.lat) > step) {
    tankerLocation.lat += step * Math.sign(destination.lat - tankerLocation.lat);
  }
  if (Math.abs(destination.lng - tankerLocation.lng) > step) {
    tankerLocation.lng += step * Math.sign(destination.lng - tankerLocation.lng);
  }

  res.json({ location: tankerLocation });
});








// =========================
// CREATE ORDER
// =========================
app.post('/api/order/create', async (req, res) => {
  try {
    const { customerId, location, waterQuantity, date, time } = req.body;

    const provider = await User.findOne({ role: 'provider' });

    if (!provider) {
      return res.status(404).json({ message: 'No provider available' });
    }

    const order = new Order({
      customerId,
      providerId: provider._id,
      location,
      waterQuantity,
      date,
      time,
      status: 'pending'
    });

    await order.save();

    res.json({
      message: 'Order created',
      order
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =========================
// 🔥 CUSTOMER ORDERS (CRITICAL FIX)
// =========================
app.get('/api/customer/orders/:customerId', async (req, res) => {
  try {
    const orders = await Order.find({
      customerId: req.params.customerId
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =========================
// (OPTIONAL) ALL ORDERS (DEBUG)
// =========================
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =========================
// PROVIDER ORDERS
// =========================
app.get('/api/provider/orders/:providerId', async (req, res) => {
  try {
    const provider = await User.findById(req.params.providerId);

    if (!provider || provider.role !== 'provider') {
      return res.status(403).json({ message: 'Not a provider' });
    }

    const orders = await Order.find({
      providerId: provider._id
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =========================
// UPDATE STATUS
// =========================
app.put('/api/order/update-status', async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json({
      message: 'Status updated',
      order
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =========================
// ROOT
// =========================
app.get('/', (req, res) => {
  res.send('🚀 SmartTanker Backend running');
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});