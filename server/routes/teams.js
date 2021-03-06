const { body } = require('express-validator');

const express = require('express'),
	isAuth = require('../middlewares/isAuth'),
	checkValidation = require('../middlewares/checkValidation'),
	router = express.Router(),
	teamApis = require('../Apis/Teams');

router.post(
	'/newTeam',
	isAuth,
	[ body('name').trim().isLength({ max: 20 }).withMessage('Team name can`t  exceed 20 characters') ],
	checkValidation,
	teamApis.createTeam
);

router.post('/addMembers', isAuth, teamApis.addMembersToTeam);

router.get('/getTeam/:teamId', isAuth, teamApis.getTeam);

router.get('/teamNotifications/:teamId', isAuth, teamApis.getTeamNotifications);

router.patch('/kickMember', isAuth, teamApis.kickMember);

router.delete('/deleteTeam/:teamId', isAuth, teamApis.deleteTeam);
module.exports = router;
