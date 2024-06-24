const pool = require('./db');

exports.create = async ({ username, password }) => {
    const [rows] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    return rows;
};

exports.findByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

exports.findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

exports.isUsernameTaken = async (username) => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users WHERE username = ?', [username]);
    return rows[0].count > 0;  // 이미 존재하면 true, 아니면 false
};

exports.withdraw = async (id) => {
    // 포트폴리오를 삭제한 후 사용자를 삭제
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
};