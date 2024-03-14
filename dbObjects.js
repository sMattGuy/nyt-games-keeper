const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Wordle = require('./models/Wordle.js')(sequelize, Sequelize.DataTypes);
const Connections = require('./models/Connections.js')(sequelize, Sequelize.DataTypes);
const Mini = require('./models/Mini.js')(sequelize, Sequelize.DataTypes);
const Strands = require('./models/Strands.js')(sequelize, Sequelize.DataTypes);

module.exports = { Wordle, Connections, Mini, Strands };