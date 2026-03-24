// sync.js
const db = require('./models');

(async () => {
  try {
    await db.sequelize.sync({ force: true }); // drops and recreates all tables
    console.log("Database synced successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
