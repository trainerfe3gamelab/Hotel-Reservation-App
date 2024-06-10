import { Sequelize, DataTypes } from 'sequelize';


const sequelize = new Sequelize('capstone', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});


const Hotel = sequelize.define('Hotel', {
    hotelId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'userId',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adultCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    childrenCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    facilities: {
        type: DataTypes.JSON, 
        allowNull: false,
    },
    pricePerNight: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imageUrls: {
        type: DataTypes.JSON, 
        allowNull: false,
    },
    lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    timestamps: true, 
    tableName: 'Hotels' 
});


sequelize.sync()
    .then(() => {
        console.log('Hotel table created successfully!');
    })
    .catch(err => {
        console.error('Error creating Hotel table:', err);
    });

export default Hotel;
