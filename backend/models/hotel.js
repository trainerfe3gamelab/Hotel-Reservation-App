import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("capstone", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const Booking = sequelize.define("Booking", {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  adultCount: { type: DataTypes.INTEGER, allowNull: false },
  childrenCount: { type: DataTypes.INTEGER, allowNull: false },
  checkIn: { type: DataTypes.DATE, allowNull: false },
  rating: {
    type: DataTypes.FLOAT, 
    allowNull: true
  },
  checkOut: { type: DataTypes.DATE, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false },
  totalCost: { type: DataTypes.FLOAT, allowNull: false },
});

const Hotel = sequelize.define("Hotel", {
  hotelId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  adultCount: { type: DataTypes.INTEGER, allowNull: false },
  childrenCount: { type: DataTypes.INTEGER, allowNull: false },
  ratingSum: { type: DataTypes.FLOAT, allowNull: true },
  facilities: { type: DataTypes.JSON, allowNull: false },
  pricePerNight: { type: DataTypes.INTEGER, allowNull: false },
  starRating: { type: DataTypes.INTEGER, allowNull: false },
  imageUrls: { type: DataTypes.JSON, allowNull: false },
  lastUpdated: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

Hotel.hasMany(Booking, {
  foreignKey: 'hotelId', 
  as: 'Bookings' 
});
Booking.belongsTo(Hotel, { foreignKey: "hotelId" });

sequelize
  .sync()
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to synchronize models:", err);
  });

export { Hotel, Booking };
