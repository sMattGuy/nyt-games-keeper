const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

require('./models/Wordle.js')(sequelize, Sequelize.DataTypes);
require('./models/Connections.js')(sequelize, Sequelize.DataTypes);
require('./models/Mini.js')(sequelize, Sequelize.DataTypes);
require('./models/Strands.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');
const alter = process.argv.includes('--alter') || process.argv.includes('-a');

sequelize.sync({ force, alter }).then(async () => {
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);
