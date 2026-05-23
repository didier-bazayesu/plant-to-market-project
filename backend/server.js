
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const db = require('./models');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [process.env.FRONTEND_URL ,'http://localhost:5173'],
}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Plant-to-Market API is running'));

app.use('/api/public',       require('./routes/publicRoutes'));
app.use('/api/users',        require('./routes/userRoutes'));
app.use('/api/farmers',      require('./routes/farmerRoutes'));
app.use('/api/farms',        require('./routes/farmRoutes'));
app.use('/api/farms',        require('./routes/farmLocationRoutes'));
app.use('/api/crops',        require('./routes/cropRoutes'));
app.use('/api/activities',   require('./routes/activityRoutes'));
app.use('/api/harvests',     require('./routes/harvestRoutes'));
app.use('/api/marketprices', require('./routes/marketPriceRoutes'));
app.use('/api/admin',        require('./routes/adminRoutes'));
app.use('/api',              require('./routes/weatherRoutes'));

app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection successful');
    await db.sequelize.sync({ force: false });
    console.log('✅ Tables synced successfully!');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
  }
});
