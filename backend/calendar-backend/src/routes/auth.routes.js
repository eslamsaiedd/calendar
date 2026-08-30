const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  signupValidator,
  loginValidator,
  googleAuthValidator,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/signup', signupValidator, validate, authController.signup);
router.post('/login', loginValidator, validate, authController.login);
router.post('/google', googleAuthValidator, validate, authController.googleAuth);
router.get('/me', protect, authController.getMe);
router.post('/logout', protect, authController.logout);
router.put('/me', protect, authController.updateMe);
router.delete('/me', protect, authController.deleteMe);

module.exports = router;
