const express = require('express');
const route = express.Router();
const userController = require('../controller/users');
const checkAuth = require('../middleware/check-auth');

route.post('/signup', userController.SIGNUP_USER);

route.post('/login', userController.LOGIN_USER);

route.post('/image', checkAuth, userController.UPLOAD_IMAGE);

route.post('/details', checkAuth, userController.ADD_USER_DETAILS);

route.get('/details', checkAuth, userController.GET_AUTHENTICATED_USER_DETAILS);

route.get('/details/:username', userController.GET_USER_DETAILS_BY_USERNAME);

route.post('/notifications', checkAuth, userController.MARK_NOTIFICATIONS_AS_READ);

module.exports = route;