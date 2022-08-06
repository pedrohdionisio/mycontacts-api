const db = require('../../database');

class UsersRepository {
  async findAll() {
    const rows = await db.query(`SELECT * FROM users`);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return row;
  }

  async create({
    name, email, password,
  }) {
    const [row] = await db.query(`
      INSERT INTO users(name, email, password) 
      VALUES($1, $2, $3)
      RETURNING *
    `, [name, email, password]);

    return row;
  };

  async update(id, {
    name, email
  }) {
    const [row] = await db.query(`
      UPDATE users
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING *
    `, [name, email, id]);
    return row;
  }

  async updatePassword(id, {
    password,
  }) {
    const [row] = await db.query(`
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING *
    `, [password, id]);
    return row;
  }

  async delete(id) {
    const deleteOp = await db.query(`
      DELETE FROM users
      WHERE id = $1
      RETURNING *
    `, [id]);
    return deleteOp;
  }
}

module.exports = new UsersRepository();