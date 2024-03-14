module.exports = (sequelize, DataTypes) => {
	return sequelize.define('strands', {
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
		theme: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		hints: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};
