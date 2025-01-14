'use strict';
const { Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    blogName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 50],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email.');
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256]
      },
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      },
    },
    avatar: {
      type: DataTypes.TEXT,
    }
  },
    {
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
        },
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ['hashedPassword'] },
        },
        loginUser: {
          attributes: {},
        },
      },
    });
  User.associate = function (models) {
    User.hasOne(models.Blog, { foreignKey: 'userId' });
    User.hasMany(models.Post, {foreignKey: 'userId'});
    User.hasMany(models.Post, {as: 'Owner', foreignKey: 'ownerId'});
    User.hasMany(models.Follow, { foreignKey: 'userId' })
    User.hasMany(models.Like, { foreignKey: 'userId' })
  };

  User.prototype.toSafeObject = function () {
    const { id, blogName, email } = this;
    return { id, blogName, email };
  };

  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  User.login = async function ({ credential, password }) {
    const { Op } = require('sequelize');
    const user = await User.scope('loginUser').findOne({
      where: {
        [Op.or]: {
          blogName: credential,
          email: credential,
        },
      },
    });
    if (user && user.validatePassword(password)) {
      return await User.scope('currentUser').findByPk(user.id);
    }
  };

  User.getCurrentUserById = async function (id) {
    return await User.scope('currentUser').findByPk(id);
  };

  User.signup = async function ({ blogName, email, password, avatar }) {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      blogName,
      email,
      hashedPassword,
      avatar
    });
    return await User.scope('currentUser').findByPk(user.id);
  };

  return User;
};

