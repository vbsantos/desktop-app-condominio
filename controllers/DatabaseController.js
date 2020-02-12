"use strict";

const Db = require("../models");
const Path = require("path");
const Umzug = require("umzug");

class DatabaseController {
  runMigrations = async () => {
    const sequelize = Db.sequelize;
    const umzug = new Umzug({
      storage: "sequelize",
      storageOptions: {
        sequelize: sequelize
      },
      migrations: {
        params: [
          sequelize.getQueryInterface(), // queryInterface
          sequelize.constructor, // DataTypes
          function() {
            throw new Error(
              'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.'
            );
          }
        ],
        path: Path.join(__dirname, "../migrations"),
        pattern: /\.js$/
      }
    });
    await umzug.up();
  };
}

module.exports = DatabaseController;
