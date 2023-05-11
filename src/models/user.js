const User = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			email: {
				type: DataTypes.STRING(30),
				allowNull: false, //필수
				unique: true,
			},
			username: {
				type: DataTypes.STRING(30),
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			}
		},
		{
			sequelize,
            timestamps: true,
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            modelName: 'User',
        },
	);
	User.associate = (db) => {
		db.User.hasMany(db.Post);
		db.User.hasMany(db.Comment);
		db.User.belongsToMany(db.Post, { through: "Like_Post", as: "Liked" });
		db.User.belongsToMany(db.User, { through: "Follow", as: "Followers", foreignKey: "followingId" });
		db.User.belongsToMany(db.User, { through: "Follow", as: "Followings", foreignKey: "followerId" });
	};
	return User;
};

export default User;
  