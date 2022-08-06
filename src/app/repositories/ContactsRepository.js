const db = require('../../database');

class ContactRepository {
  async findAll(orderBy = 'ASC', { user_id }) {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(`
      SELECT contacts.*, categories.name AS category_name
      FROM contacts
      LEFT JOIN categories ON categories.id = contacts.category_id
      WHERE contacts.user_id = $1
      ORDER BY contacts.name ${direction}`, [user_id]);
    return rows;
  }

  async findById(id, { user_id }) {
    const [row] = await db.query(`
      SELECT contacts.*, categories.name AS category_name 
      FROM contacts 
      LEFT JOIN categories ON categories.id = contacts.category_id
      WHERE contacts.user_id = $2
      AND contacts.id = $1
    `, [id, user_id]);
    return row;
  }

  async findByEmail(email, { user_id }) {
    const [row] = await db.query(`
      SELECT * FROM contacts
      WHERE user_id = $2
      AND email = $1
    `, [email, user_id]);
    return row;
  }

  async create({
    name, email, phone, category_id, user_id,
  }) {
    const [row] = await db.query(`
      INSERT INTO contacts(name, email, phone, category_id, user_id)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, email, phone, category_id, user_id]);

    return row;
  };

  async update(id, {
    name, email, phone, category_id, user_id,
  }) {
    const [row] = await db.query(`
      UPDATE contacts
      SET name = $1, email = $2, phone = $3, category_id = $4, user_id = $6
      WHERE id = $5
      RETURNING *
    `, [name, email, phone, category_id, id, user_id]);
    return row;
  }

  async delete(id, { user_id }) {
    const deleteOp = await db.query(`
      DELETE FROM contacts
      WHERE user_id = $2
      AND id = $1
      RETURNING *
    `, [id, user_id]);
    return deleteOp;
  }
}

module.exports = new ContactRepository();
