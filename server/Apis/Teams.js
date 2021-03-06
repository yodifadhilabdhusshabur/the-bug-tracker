const sendError = require('../helpers/sendError');
const Team = require('../models/Team'),
	User = require('../models/User'),
	Project = require('../models/Project'),
	Notification = require('../models/Notification'),
	paginationItems = require('../helpers/paginationItems').paginationItems;

exports.createTeam = async (req, res, next) => {
	const { userId } = req;

	const { name } = req.body;

	const team = await Team.create({ leader: userId, name, members: [ userId ] });

	res.status(201).json({ message: 'Team Added Successfully', team: team });
};

exports.addMembersToTeam = async (req, res, next) => {
	const { userId } = req;

	try {
		const newTeam = await Team.addMembers(userId, req.body);

		res.status(201).json({ message: 'New members added successfully', updatedTeam: newTeam });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getTeam = async (req, res, next) => {
	const { teamId } = req.params;

	try {
		// unfortunately, i will populate(aggregate) the project bugs in order to fetch the bug status which is mandatory for manipulating the team statistics

		const team = await Team.findById(teamId)
			.populate({
				path: 'projects',
				select: Project.publicProps().join(' ') + ' bugs',
				populate: { path: 'owner', select: User.publicProps().join(' ') },
				populate: { path: 'bugs', select: 'status' }
			})
			.populate({ path: 'members', select: User.publicProps().join(' ') })
			.select('-notifications')
			.lean();

		if (!team) sendError('Team not found', 404);

		const teamStatistics = Team.analyzeTeamStatistics(Project, team);

		res.status(200).json({ team, teamStatistics });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.getTeamNotifications = async (req, res, next) => {
	const { teamId } = req.params;

	let { page } = req.query;

	const PER_PAGE = 5;

	page = parseInt(page);

	const SKIP = (page - 1) * PER_PAGE;

	try {
		const team = await Team.findById(teamId).lean();

		if (!team) sendError('team is not found', 404);

		const teamNotifications = team.notifications;

		if (teamNotifications.length > 0) {
			const notifications = await Notification.find({ _id: { $in: teamNotifications } })
				.sort('-createdAt')
				.populate({ path: 'from', select: User.publicProps().join(' ') })
				.populate({ path: 'to', select: User.publicProps().join(' ') })
				.skip(SKIP)
				.limit(PER_PAGE)
				.lean();

			const paginationItemsCount = paginationItems(teamNotifications.length, PER_PAGE);

			res.status(200).json({ notifications, paginationItemsCount });
		} else {
			res.status(200).json({ notifications: [] });
		}
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.kickMember = async (req, res, next) => {
	const { userId } = req;

	try {
		await Team.kickMember(userId, req.body, Project);
		res.status(200).json({ message: 'User kicked successfully', user: userId });
	} catch (error) {
		if (!error.statusCode) error.statusCode = 500;
		next(error);
	}
};

exports.deleteTeam = async (req, res, next) => {
	const { userId } = req;
	const { teamId } = req.params;
	try {
		await Team.deleteTeam(userId, Project, teamId);
		res.status(200).json({ message: 'Team deleted successfully' });
	} catch (error) {
		error.statusCode = error.statusCode || 500;
		next(error);
	}
};
