const express = require('express'),
	isAuth = require('../middlewares/isAuth'),
	checkValidation = require('../middlewares/checkValidation'),
	usersApis = require('../Apis/users'),
	router = express.Router();

const { body } = require('express-validator');

router.get('/personalData', isAuth, usersApis.getPersonalUserData);

router.get('/userNotifications', isAuth, usersApis.getUserNotifications);

router.patch(
	'/editPersonalData',
	isAuth,
	[ body('firstName', 'FirstName is required').notEmpty(), body('lastName', 'LastName is required').notEmpty() ],
	checkValidation,
	usersApis.editPersonalData
);

router.post(
	'/newProject',
	[ body('name', 'Name can`t be empty').notEmpty() ],
	checkValidation,
	isAuth,
	usersApis.createNewProject
);

router.get('/getUserWithPrivateKey/:privateKey', isAuth, usersApis.getUserWithPrivateKey);

router.post(
	'/addBug',
	isAuth,
	[
		body('name', 'Name must be not empty, ').trim().isLength({ max: 100 }).notEmpty(),
		body('description', 'Description is required').notEmpty()
	],
	checkValidation,
	usersApis.addNewBug
);

router.patch(
	'/editProject',
	isAuth,
	[ body('newName', 'Name can`t be empty').notEmpty() ],
	checkValidation,
	usersApis.editProjectDetails
);

router.patch(
	'/editBug',
	isAuth,
	[
		body('newName', 'Name must be not empty').notEmpty(),
		body('newDescription', 'Description is required').notEmpty()
	],
	checkValidation,
	usersApis.editBugDetails
);

router.patch('/fixBug', isAuth, usersApis.fixBug);

router.patch('/seenNotifications', isAuth, usersApis.seeNotifications);

router.patch('/bugReopen', isAuth, usersApis.bugReopen);

router.patch('/closeOrReOpenProject', isAuth, usersApis.closeOrReOpenProject);

router.delete('/deleteProject', isAuth, usersApis.deleteProject);

router.get('/bugDetails/:bugId', isAuth, usersApis.getBugDetails);

router.get('/personalProjects', isAuth, usersApis.getPersonalProjects);

router.patch('/regeneratePrivateKey', isAuth, usersApis.regeneratePrivateKey);

router.get('/projectDetails/:projectId', isAuth, usersApis.getProjectDetails);

router.get('/projectTimeline/:projectId', isAuth, usersApis.getProjectTimeline);

router.get('/userTeams', isAuth, usersApis.getUserTeams);

module.exports = router;
