let config = require("../config/knexFile");

let knex = require("knex")(config);

module.export = knex;
