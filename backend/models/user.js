import { Sequelize, DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';


const sequelize = new Sequelize('capstone', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

class User extends Model {
  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  timestamps: true,
  hooks: {
    beforeSave: async (user, options) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 8);
      }
    }
  }
});

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });

export default User;
