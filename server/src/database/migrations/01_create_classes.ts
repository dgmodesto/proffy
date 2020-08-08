import knex from 'knex';

export async function up(knex: knex) {
  return knex.schema.createTable('classes', table => {
    table.increments('id').primary();
    table.string('subject').notNullable();
    table.decimal('cost').notNullable();

    // criando uma chave estrangeira
    // o cascade serve para refletir as diferenças em todas as referencias
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: knex) {
  return knex.schema.dropTable('classes');
}