const { User, Farmer } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {

  // ── REGISTER ────────────────────────────────────────────
  register: async (req, res) => {
    try {
      const { name, email, password, phone, district, role = 'farmer' } = req.body;

      // Check duplicate email
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        name, email,
        password: hashedPassword,
        phone, district, role
      });

      // Create farmer profile
      if (role === 'farmer') {
            await Farmer.create({
                userId: user.id,       // ✅ was user_id
                name,
                email,
                phone,
                passwordHash: hashedPassword  // ✅ was password_hash
            });
        }

      // ✅ Generate token on register
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // ✅ Return format frontend expects
      res.status(201).json({
        message: 'Registration successful',
        token,
        farmer: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          district: user.district,
          role: user.role,
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  // ── LOGIN ────────────────────────────────────────────────
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // ✅ Return format frontend expects
      res.json({
        message: 'Login successful',
        token,
        farmer: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          district: user.district,
          role: user.role,
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  },

  // ── ME ───────────────────────────────────────────────────
  me: async (req, res) => {
    try {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        district: req.user.district,
        role: req.user.role,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};