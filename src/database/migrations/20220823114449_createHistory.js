exports.up = knex => knex.schema.createTable("history", table => {
  table.increments("id");

  table.integer("user_id").references("id").inTable("users");
  table.integer("item_id").references("id").inTable("item");

  table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("history");