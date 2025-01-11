"use strict";

const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const ApiError = require("../utils/apiError");
const blog = require("./blogs");
const post = require("./posts");

const user = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate a UUID for new entries
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      validate: {
        notNull: {
          msg: "firstName cannot be null",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      validate: {
        notNull: {
          msg: "lastName cannot be null",
        },
      },
    },
    isProfileComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "email cannot be null",
        },
        notEmpty: {
          msg: "email cannot be empty",
        },
        isEmail: {
          msg: "Invalid email address",
        },
      },
      set(value) {
        // const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(value)) {
          throw new ApiError("Invalid email format", 400);
        } else {
          this.setDataValue("email", value);
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "password cannot be null",
        },
        notEmpty: {
          msg: "password cannot be empty",
        },
      },
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (this.password.length < 8) {
          throw new ApiError("Password length must be greater than 8", 400);
        }
        // Validate password strength
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;
        if (!passwordRegex.test(this.password)) {
          throw new ApiError(
            "Password must contain at least one lowercase letter, one uppercase letter, and one digit.",
            400,
          );
        }
        if (value === this.password) {
          const hashPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashPassword);
        } else {
          throw new ApiError("Password must match", 400);
        }
      },
    },
    userType: {
      type: DataTypes.ENUM("admin", "end_user", "agent"),
      allowNull: false,
      defaultValue: "end_user",
      validate: {
        notNull: {
          msg: "userType cannot be null",
        },
        notEmpty: {
          msg: "userType cannot be empty",
        },
        isIn: {
          args: [["admin", "end_user", "agent"]],
          msg: "UserType must be one of: 'admin', 'end_user', 'agent'",
        },
      },
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      defaultValue: "",
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("", "Male", "Female"),
      defaultValue: "",
      allowNull: true,
      validate: {
        isIn: {
          args: [["", "Male", "Female"]],
          msg: "Gender must be one of: 'Male', 'Female' or empty",
        },
      },
    },
    occupation: {
      type: DataTypes.STRING,
      default: "",
      allowNull: true,
    },
    yearsOfExperience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "users",
  },
);

// user blog
user.hasMany(blog, { foreignKey: "createdBy" });
blog.belongsTo(user, {
  foreignKey: "createdBy",
});

// user post
user.hasMany(post, { foreignKey: "createdBy" });
post.belongsTo(user, {
  foreignKey: "createdBy",
});

module.exports = user;
