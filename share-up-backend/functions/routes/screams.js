const express = require('express');
const route = express.Router();
const checkAuth = require('../middleware/check-auth');
const screamController = require('../controller/screams');

route.get('/all', screamController.GET_ALL_SCREAMS);

route.post('/', checkAuth, screamController.ADD_SCREAM);

route.get('/:screamId', screamController.GET_SINGLE_SCREAM);

route.post('/:screamId/comment', checkAuth, screamController.COMMENT_ON_SCREAM);

route.get('/:screamId/like', checkAuth, screamController.LIKE_SCREAM);

route.get('/:screamId/unlike', checkAuth, screamController.UNLIKE_STREAM);

route.delete('/:screamId', checkAuth, screamController.DELETE_SCREAM);

module.exports = route;