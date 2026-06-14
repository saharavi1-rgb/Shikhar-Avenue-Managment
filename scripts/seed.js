require('dotenv').config();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS dues');
    await pool.query('DROP TABLE IF EXISTS members');

    await pool.query(`
      CREATE TABLE members (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE dues (
        id SERIAL PRIMARY KEY,
        member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        due_date DATE NOT NULL,
        payment_date DATE,
        status VARCHAR(20) DEFAULT 'pending',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const hashedPassword = await bcrypt.hash('password123', 10);
    const memberResult = await pool.query(
      'INSERT INTO members (email, password, name, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['john.doe@example.com', hashedPassword, 'John Doe', '9876543210', '123 Main St']
    );

    const memberId = memberResult.rows[0].id;

    await pool.query(
      'INSERT INTO dues (member_id, amount, due_date, status, description) VALUES ($1, $2, $3, $4, $5)',
      [memberId, 5000, '2024-06-30', 'paid', 'Monthly maintenance fee']
    );
    await pool.query(
      'INSERT INTO dues (member_id, amount, due_date, status, description) VALUES ($1, $2, $3, $4, $5)',
      [memberId, 5000, '2024-07-30', 'pending', 'Monthly maintenance fee']
    );
    await pool.query(
      'INSERT INTO dues (member_id, amount, due_date, status, description) VALUES ($1, $2, $3, $4, $5)',
      [memberId, 2000, '2024-08-15', 'pending', 'Annual registration fee']
    );

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();