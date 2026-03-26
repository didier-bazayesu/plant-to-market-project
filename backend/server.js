const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const errorHandler = require('./middlewares/errorHandler'); // 1. Import the handler

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => res.send('Plant-to-Market API is running'));

// Routes
app.use('/farmers', require('./routes/farmerRoutes'));
app.use('/farms', require('./routes/farmRoutes'));
app.use('/crops', require('./routes/cropRoutes'));
app.use('/activities', require('./routes/activityRoutes'));
app.use('/harvests', require('./routes/harvestRoutes'));
app.use('/marketprices', require('./routes/marketPriceRoutes'));

// 2. Handle 404 - Not Found (Optional but recommended)
app.use((req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error); // Passes the error to the Catch-All below
});

// 3. The Catch-All Error Handler (Must be after all routes)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log(`Database connected and server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
});