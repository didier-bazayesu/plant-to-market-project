const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');
const { body, validationResult } = require('express-validator');


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

// Start server
app.listen(PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log(`Database connected and server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
});
