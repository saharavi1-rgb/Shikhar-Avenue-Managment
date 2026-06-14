const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, amount, due_date, payment_date, status, description FROM dues WHERE member_id = $1 ORDER BY due_date DESC',
      [req.memberId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/summary', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT SUM(CASE WHEN status = \'pending\' THEN amount ELSE 0 END) as pending_amount, SUM(CASE WHEN status = \'paid\' THEN amount ELSE 0 END) as paid_amount, COUNT(*) as total_dues FROM dues WHERE member_id = $1',
      [req.memberId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;