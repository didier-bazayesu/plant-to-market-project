// models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const db = {};

// Initialize Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT,
    logging: false, // disable SQL logging for cleaner console
  }
);

// Dynamically import all model files
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // skip hidden files
      file !== basename &&       // skip this index.js file
      file.slice(-3) === '.js'   // only .js files
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Apply associations if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach Sequelize instance and library to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;