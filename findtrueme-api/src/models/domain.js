const Domain = (sequelize, DataTypes) => {
    const Domain = sequelize.define(
        'Domain', 
        {
            host: {
                type: DataTypes.STRING(400),
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('free', 'premium'),
                allowNull: false,
                defaultValue: 'free'
            },
            clientSecret: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        }, 
        {
            sequelize,
            timestamps: true,
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            modelName: 'Domain',
            tableName: 'domains'
        },
    );
    
    Domain.associate = (db) => {
        db.Domain.belongsTo(db.User);
    };
    return Domain;
};
  
export default Domain;