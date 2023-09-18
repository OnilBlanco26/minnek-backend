const { DataTypes } = require("sequelize");
const { db } = require("../database/db");

const SubBreed = db.define('subBreed', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false

    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

})

module.exports = SubBreed