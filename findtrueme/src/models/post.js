const Post = (sequelize, DataTypes) => {
    const Post = sequelize.define(
        'Post', 
        {
            title: {
                type: DataTypes.STRING(30),
                allowNull: false,
                defaultValue: 'No Title',
            },
            content: {
                type: DataTypes.STRING(400),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            modelName: 'Post',
        },
    );
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsToMany(db.User, { through: 'Like_Post', as: 'Liker' });
        db.Post.belongsToMany(db.Hashtag, { through: 'Hashtag_Post'});
    };
    return Post;
};

export default Post;
  