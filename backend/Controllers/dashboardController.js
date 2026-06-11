exports.getDashboardData = async (req, res) => {
  try {
    // 👇 role comes from query OR headers (flexible)
    const role = req.query.role || req.headers.role;

    // =========================
    // 👤 CUSTOMER DASHBOARD
    // =========================
    if (role === 'customer') {
      const data = {
        tankLevel: 45,
        activeOrders: 2,
        bookingHistory: [
          { id: 1, date: '2025-10-10', status: 'Delivered' },
          { id: 2, date: '2025-10-15', status: 'Pending' },
        ]
      };

      return res.json(data);
    }

    // =========================
    // 🚛 PROVIDER DASHBOARD
    // =========================
    if (role === 'provider') {
      const data = {
        assignedOrders: 3,
        earnings: 12000,
        deliveries: [
          { id: 1, location: 'Area A', status: 'On the way' },
          { id: 2, location: 'Area B', status: 'Delivered' },
        ]
      };

      return res.json(data);
    }

    // =========================
    // 🛠 ADMIN DASHBOARD
    // =========================
    if (role === 'admin') {
      const data = {
        totalUsers: 50,
        totalOrders: 120,
        activeProviders: 8
      };

      return res.json(data);
    }

    // =========================
    // DEFAULT RESPONSE
    // =========================
    return res.json({
      message: 'Invalid role or role not provided'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};