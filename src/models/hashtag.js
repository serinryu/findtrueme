const Hashtag = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define(
        'Hashtag', 
        {
            hashtag_name : {
                type: DataTypes.STRING(10),
                allowNull: true,
                unique: true,
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
            modelName: 'Hashtag',
        },
    );
    
    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Post, { through: 'Hashtag_Post'});
    };
    return Hashtag;
};
  
export default Hashtag;