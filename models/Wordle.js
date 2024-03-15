module.exports = (sequelize, DataTypes) => {
	return sequelize.define('wordle', {
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
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};
