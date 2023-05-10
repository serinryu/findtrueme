const Comment = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        'Comment', 
        {
            content: {
                type: DataTypes.STRING(400),
                allowNull: true,
            },
            like_count: {
                type: DataTypes.INTEGER,
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
            modelName: 'Hashtag',
        },
    );
    
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
        db.Comment.belongsTo(db.Comment, { as: 'ParentComment' });
    };
    return Comment;
};
  
export default Comment;