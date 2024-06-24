const pool = require('./db');

exports.create = async ({ title, description, userId }) => {
    const [rows] = await pool.query('INSERT INTO portfolio (title, description, userId) VALUES (?, ?, ?)', [title, description, userId]);
    return rows;
};

exports.getByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM portfolio WHERE userId = ?', [userId]);
    return rows;
};

exports.deleteById = async (portfolioId, userId) => {
    const deleteQuery = 'DELETE FROM portfolio WHERE id = ? AND userId = ?';

    try {
        const [result] = await pool.query(deleteQuery, [portfolioId, userId]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};

exports.deleteByUserId = async (userId) => {
    // 사용자 ID로 모든 포트폴리오를 삭제
    await pool.query('DELETE FROM portfolio WHERE userId = ?', [userId]);
};

exports.delete = async (id) => {
    // 특정 포트폴리오 삭제
    await pool.query('DELETE FROM portfolio WHERE id = ?', [id]);
};