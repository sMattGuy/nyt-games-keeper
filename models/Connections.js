module.exports = (sequelize, DataTypes) => {
	return sequelize.define('connections', {
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		server_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		puzzle_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		guesses: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};
