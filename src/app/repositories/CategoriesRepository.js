const db = require('../../database');

class CategoryRepository {
  async findAll(orderBy = 'ASC', { user_id }) {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(`
      SELECT * FROM categories
      WHERE user_id = $1
      ORDER BY name ${direction}
    `, [user_id]);
    return rows;
  }

  async findById(id, { user_id }) {
    const [row] = await db.query(`
      SELECT * FROM categories 
      WHERE user_id = $2
      AND id = $1
    `, [id, user_id]);
    return row;
  }

  async findByName(name, { user_id }) {
    const [row] = await db.query(`
      SELECT * FROM categories
      WHERE user_id = $2
      AND name = $1`, [name, user_id]
    );
    return row;
  }

  async create({ name, user_id }) {
    const [row] = await db.query(`
      INSERT INTO categories(name, user_id)
      VALUES ($1, $2)
      RETURNING *
    `, [name, user_id]);
    return row;
  }

  async update(id, { name, user_id }) {
    const [row] = await db.query(`
    UPDATE categories
    SET name = $1, user_id = $3
    WHERE id = $2
    RETURNING *
  `, [name, id, user_id]);
    return row;

  }

  async delete(id, { user_id }) {
    const row = await db.query(`
      DELETE FROM categories
      WHERE user_id = $2
      AND id = $1
      RETURNING *
    `, [id, user_id]);
    return row;
  }

}

module.exports = new CategoryRepository();