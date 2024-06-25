const Project = require('../models/portfolio');
const User = require('../models/user');

exports.portfolioPage = async (req, res) => {
    try {
        const projects = await Project.getByUserId(req.user.id);
        res.render('portfolio', { user: req.user, projects });
    } catch (error) {
        res.render('error', { message: `오류 발생! ${error.message}` });
    }
};

// 프로젝트 추가 페이지 함수
exports.addProjectPage = (req, res) => {
    res.render('addProject', { user: req.user });
};

// 프로젝트 추가 함수
exports.addProject = async (req, res) => {
    const { title, description } = req.body;
    try {
        await Project.create({ title, description, userId: req.user.id });
        res.redirect('/portfolio');
    } catch (error) {
        res.status(500).send('Server error');
    }
};

exports.deletePortfolio = async (req, res) => {
    const portfolioId = req.params.id;
    const userId = req.user.id; // 현재 로그인한 사용자의 ID

    try {
        // 포트폴리오 삭제 함수 호출
        const deletedRows = await Project.deleteById(portfolioId, userId);

        if (deletedRows === 0) {
            res.render('error', { message: "포트폴리오가 존재하지 않거나, 삭제 권한이 없습니다" });
        }
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.render('error', { message: `오류 발생! ${error.message}` });
    }

    res.redirect('/portfolio');
};