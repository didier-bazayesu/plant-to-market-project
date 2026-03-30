require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => res.send('Plant-to-Market API is running'));

// ✅ All routes with /api prefix
app.use('/api/users',       require('./routes/userRoutes'));
app.use('/api/farmers',     require('./routes/farmerRoutes'));
app.use('/api/farms',       require('./routes/farmRoutes'));
app.use('/api/crops',       require('./routes/cropRoutes'));
app.use('/api/activities',  require('./routes/activityRoutes'));
app.use('/api/harvests',    require('./routes/harvestRoutes'));
app.use('/api/marketprices',require('./routes/marketPriceRoutes'));
const adminRoutes = require('./routes/adminRoutes');
console.log("Admin routes loaded:", !!adminRoutes); 
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection successful');
    await db.sequelize.sync({ force: false }); // ✅ never drop tables
    console.log('✅ Tables synced successfully!');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
  }
});