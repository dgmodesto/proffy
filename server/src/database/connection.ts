import knex from 'knex';
import path from 'path';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite')
  },
  useNullAsDefault: true // necessário porque o sqlite não sabe o que deve ser o conteúdo de uma info quando estiver nulo
});


export default db;