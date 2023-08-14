const express = require('express');
const router = express.Router();
const userControlers = require('../controlers/userControlers');
const authControler = require('../controlers/authController');

router.post('/signup', authControler.signup);
router.post('/login', authControler.login);
router.get("/logout",authControler.logout)
router.post('/forgotPassword', authControler.forgotPassword);
router.patch('/resetPassword/:token', authControler.resetPassword);
// protecting all routes after that middleware
router.use(authControler.protect);
router.patch('/updatePassword/', authControler.updatePassword);
router.get('/me', userControlers.getMe, userControlers.getUser);
router.delete('/deleteMe', userControlers.deleteMe);
router.patch('/updateMe',userControlers.uploadPhoto,userControlers.resizeUserPhoto, userControlers.updateMe);
router.route('/').get(userControlers.allUsers).post(userControlers.createUser);
router
  .route('/:id')
  .get(userControlers.getUser)
  .delete(userControlers.deleteUser)
  .patch(userControlers.updateUser);

module.exports = router;
