const sendError = require('../helpers/sendError'),
	Project = require('../models/Project'),
	Team = require('../models/Team'),
	User = require('../models/User'),
	Bug = require('../models/Bug'),
	Timeline = require('../models/Timeline'),
	fs = require('fs'),
	paginationItems = require('../helpers/paginationItems').paginationItems,
	generateRandomId = require('../helpers/crypto');

exports.editPersonalData = async (req, res, next) => {
	// this api edit the personalData (editing the )
	const { userId, file } = req;

	try {
		const user = await User.editPersonalData(userId, file, req.body);

		file
			? fs.unlink(file.path, err => {
					if (err) console.log('file have not been removed from the file system');
				})
			: null;

		res.status(200).json({ message: 'Profile updated successfully', userId: userId, user });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.createNewProject = async (req, res, next) => {
	const { userId: ownerId } = req;

	try {
		await Project.createProject(ownerId, req.body);

		res.status(200).json({ message: 'Project added successfully' });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.addNewBug = async (req, res, next) => {
	const userId = req.userId;

	try {
		await Project.addBug(userId, req.body);

		res.status(201).json({ message: 'Bug added successfully', status: true });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.fixBug = async (req, res, next) => {
	const { userId } = req;

	try {
		await Project.fixBug(userId, req.body);

		res.status(200).json({ message: 'Bug fixed successfully', status: true });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.bugReopen = async (req, res, next) => {
	const { userId } = req;
	try {
		await Project.reOpenBug(userId, req.body);

		res.status(200).json({ message: 'Bug reOpened successfully', status: true });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.closeOrReOpenProject = async (req, res, next) => {
	const { userId } = req;
	try {
		const { status } = await Project.closeOrReOpenProject(userId, req.body);

		status === 1
			? res.status(200).json({ message: 'Project has been closed successfully', status })
			: res.status(200).json({ message: 'Project has been re opened successfully', status });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.editBugDetails = async (req, res, next) => {
	const { userId } = req;
	const { bugId, newName, newDescription, projectId } = req.body;

	try {
		const bug = await Bug.findById(bugId);

		const project = await Project.findById(projectId).select('status').lean();

		if (project.status === 1) sendError('You can`t work on a closed Project.', 403);

		if (!bug) sendError('Bug is not found', 404);

		if (bug.creator.toString() !== userId) sendError('User is not bug owner', 404);

		bug.name = newName;
		bug.description = newDescription;

		await bug.save();

		res.status(200).json({ message: 'Bug Edited Successfully' });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.editProjectDetails = async (req, res, next) => {
	const { userId } = req;

	const { projectId, newName } = req.body;

	try {
		const user = await User.findById(userId);

		if (!user) sendError('User is not found', 404);

		const project = await Project.findById(projectId);

		if (!user) sendError('Project is not found', 404);

		if (project.owner.toString() !== userId) sendError('Project is not found', 404);

		project.name = newName;

		const { name } = await project.save();

		res.status(200).json({ message: 'Project updated successfully', name });
	} catch (error) {
		error.statusCode = error.statusCode || 500;
		next(error);
	}
};

exports.regeneratePrivateKey = async (req, res, next) => {
	const { userId } = req;

	try {
		const user = await User.findById(userId);

		if (!user) sendError('User is not found', 404);

		user.privateKey = await generateRandomId(18);

		const { privateKey: newPrivateKey } = await user.save();

		res.status(200).json({ newPrivateKey, message: 'New private key regenerated successfully.' });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.seeNotifications = async (req, res, next) => {
	const { userId } = req;
	try {
		await User.seeNotifications(userId);

		res.status(200).json({ seen: true });
	} catch (error) {
		error.statusCode = error.statusCode || 500;

		next(error);
	}
};

exports.deleteProject = async (req, res, next) => {
	const { userId } = req;

	try {
		await Project.deleteProject(userId, req.query);

		res.status(200).json({ message: 'Project removed successfully' });
	} catch (error) {
		error.statusCode = error.statusCode || 500;
		next(error);
	}
};
// _____________________GET APIS & POPULATION(Aggregation)______________________

exports.getPersonalUserData = async (req, res, next) => {
	const { userId } = req;

	try {
		const user = await User.findById(userId).select(User.publicProps().join(' ') + ' privateKey email').lean();

		if (!user) sendError('User is not found', 404);

		res.status(200).json({ user });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

// i made an isolated api for getting the notifications to make working with sockets easier as i will just resend another request if something happens that requiring notifiying the user
exports.getUserNotifications = async (req, res, next) => {
	const { userId } = req;
	try {
		let user = await User.findById(userId)
			.select('notifications')
			.populate({ path: 'notifications.from', select: User.publicProps().join(' ') })
			.lean();

		if (user.notifications.length > 0) {
			user.notifications = user.notifications.sort((a, b) => b.date - a.date);
		}
		res.status(200).json({ notifications: user.notifications });
	} catch (error) {
		error.statusCode = error.statusCode || 500;
		next(error);
	}
};

exports.getUserWithPrivateKey = async (req, res, next) => {
	const { privateKey } = req.params,
		{ teamId } = req.query;

	try {
		const [ user, team ] = await Promise.all([
			User.findOne({ privateKey }).lean().select(User.publicProps().join(' ')),
			Team.findById(teamId).select('members').lean()
		]);

		if (!user) sendError('No Results', 404);

		if (!team) sendError('Team is not found', 404);

		const teamMembers = team.members;

		const foundUser = teamMembers.find(member => member.toString() === user._id.toString());

		if (foundUser) sendError('User is already in your team', 403);

		res.status(200).json({ user, message: 'User is found successfully' });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getPersonalProjects = async (req, res, next) => {
	const { userId } = req;

	try {
		const personalProjects = await Project.find({ $and: [ { owner: userId }, { type: 'private' } ] })
			.select(Project.publicProps().join(' ') + ' bugs')
			.lean();
		// returning bugs for getting the bugs length

		res.status(200).json({ message: 'Projects fetched sussessfully', projects: personalProjects });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getBugDetails = async (req, res, next) => {
	const { bugId } = req.params;

	try {
		const bug = await Bug.findById(bugId)
			.populate({ path: 'creator', select: User.publicProps().join(' ') })
			.populate({ path: 'fixer', select: User.publicProps().join(' ') })
			.lean();

		res.status(200).json({ bug });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getProjectDetails = async (req, res, next) => {
	const { projectId } = req.params;

	try {
		const project = await Project.findById(projectId)
			.select('-timeline')
			.populate({
				path: 'bugs',
				populate: [
					{
						path: 'creator',
						select: User.publicProps().join(' ')
					},
					{ path: 'fixer', select: User.publicProps().join(' ') }
				]
			})
			.populate({ path: 'owner', select: User.publicProps().join(' ') })
			.lean();

		// time line will have its own api
		if (!project) sendError('Project is not founbd', 404);

		const projectStatistics = Project.analyzeProjectStatistics(project);
		res.status(200).json({ project, projectStatistics });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getProjectTimeline = async (req, res, next) => {
	const { projectId } = req.params;

	let { page } = req.query;

	page = parseInt(page); // make sure its number

	const PER_PAGE = 5;

	const SKIP = (page - 1) * PER_PAGE;

	try {
		const project = await Project.findById(projectId).lean();

		if (!project) sendError('Project is not found', 404);

		const projectTimelines = project.timeline; // [ObjectId, ObjectId]

		if (projectTimelines.length === 0) {
			return res.status(200).json({ timeline: [] });
		}

		const timeline = await Timeline.find({ _id: { $in: projectTimelines } })
			.sort('-date')
			.populate({ path: 'from', select: User.publicProps().join(' ') })
			.populate({ path: 'bug', select: 'name createdAt' })
			.skip(SKIP)
			.limit(PER_PAGE)
			.lean();

		const paginationItemsCount = paginationItems(projectTimelines.length, PER_PAGE);

		res.status(200).json({ timeline, paginationItemsCount });
	} catch (error) {
		error.statusCode = error.statusCode || 500;
		next(error);
	}
};

exports.getUserTeams = async (req, res, next) => {
	const { userId } = req;
	const { forTeamSelecting } = req.query;

	try {
		const query = { members: userId };

		const teams =
			forTeamSelecting === 'yes'
				? await Team.find(query).select('name').lean()
				: await Team.find(query)
						.populate({ path: 'leader', select: 'firstName lastName' })
						.select('name leader members projects')
						.lean();

		res.status(200).json({ teams });
	} catch (error) {
		error.statusCode = error.statusCode || 500;
		next(error);
	}
};
