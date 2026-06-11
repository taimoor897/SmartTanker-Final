const User = require('../user');

exports.getUserStats = async (req, res) => {
    try {
      const totalCustomers = await User.countDocuments({
        role: 'customer'
      });
  
      const totalProviders = await User.countDocuments({
        role: 'provider'
      });
  
      const totalUsers = totalCustomers + totalProviders;
  
      res.json({
        totalCustomers,
        totalProviders,
        totalUsers
      });
  
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };
  exports.getUsersByRole = async (req, res) => {
    try {
      const { role } = req.params;
  
      const users = await User.find(
        { role },
        { name: 1, email: 1 }
      );
  
      res.json(users);
  
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };
  exports.getUsersByRole = async (req, res) => {
    try {
      const users = await User.find({
        role: req.params.role
      }).select('name email createdAt');
  
      res.json(users);
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };