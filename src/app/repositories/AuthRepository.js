const db = require('../../database');

class AuthRepository {
  async findByEmail(email) {
    const [row] = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return row;
  }
}

module.exports = new AuthRepository();