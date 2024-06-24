const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Portfolio = require('../models/portfolio');

require('../config/passport')(passport);

exports.registerPage = (req, res) => {
    res.render('register');
};

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        // 사용자 이름이 이미 존재하는지 확인
        const isUsernameTaken = await User.isUsernameTaken(username);
        if (isUsernameTaken) {
            return res.render('error', { message: '이미 사용중인 ID입니다' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        req.flash('success', 'You are registered and can now log in');
        res.redirect('/auth/login');
    } catch (error) {
        res.render('error', { message: `오류 발생! ${error.message}` });
    }
};

exports.loginPage = (req, res) => {
    res.render('login');
};

exports.login = passport.authenticate('local', {
    successRedirect: '/portfolio',
    failureRedirect: '/auth/login',
    failureFlash: true
});

// Updated logout method
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash('error', 'Failed to logout.');
            return res.redirect('/');
        }
        res.redirect('/');
    });
};

exports.withdrawPage = (req, res) => {
    res.render('withdraw');
};

exports.withdraw = async (req, res) => {
    if (!req.user) {
        req.flash('error', 'You must be logged in to delete your account.');
        return res.redirect('/auth/login');
    }

    const userId = req.user.id;

    try {
        // 사용자의 모든 포트폴리오를 먼저 삭제
        await Portfolio.deleteByUserId(userId);

        // 사용자의 계정 삭제
        await User.withdraw(userId);

        // 세션 파괴
        req.logout((err) => {
            if (err) {
                req.flash('error', 'Failed to log out after withdrawal.');
                return res.redirect('/');
            }
            req.flash('success', 'Account successfully deleted.');
            res.redirect('/');
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        req.flash('error', 'Server error. Unable to delete account.');
        res.redirect('/');
    }
};