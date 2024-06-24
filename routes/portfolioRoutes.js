const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioControllers');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// 프로젝트 보기 라우트
router.get('/', ensureAuthenticated, portfolioController.portfolioPage);

// 프로젝트 추가 페이지 라우트
router.get('/add', ensureAuthenticated, portfolioController.addProjectPage);

// 프로젝트 추가 라우트
router.post('/add', ensureAuthenticated, portfolioController.addProject);

// 프로젝트 삭제 라우트
router.post('/delete/:id', ensureAuthenticated, portfolioController.deletePortfolio);

module.exports = router;