const Image = (sequelize, DataTypes) => {
    const Image = sequelize.define(
        'Image', 
        {
            image_url: {
                type: DataTypes.STRING(400),
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
        }, 
        {
            sequelize,
            timestamps: true,
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            modelName: 'Hashtag',
        },
    );
    
    Image.associate = (db) => {
        db.Image.belongsTo(db.Post);
    };
    return Image;
};
  
export default Image;