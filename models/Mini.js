module.exports = (sequelize, DataTypes) => {
	return sequelize.define('mini', {
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		server_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		time: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};
