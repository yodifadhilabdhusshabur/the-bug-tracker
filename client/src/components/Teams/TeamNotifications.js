import React from 'react';
import Paper from '@material-ui/core/Paper';
import { toDate } from '../../helpers';
import { connect } from 'react-redux';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

function TeamNotifications(props) {
	const { teamNotifications, teamProjects, userId, paginationItemsCount } = props;

	let notifications = <h2 className='secondary text-center'>Notifications Are Empty.</h2>;

	if (teamNotifications.length > 0) {
		notifications = teamNotifications.map((n, i) => {
			const from = n.from._id === userId ? 'You' : `${n.from.firstName} ${n.from.lastName}`;

			if (n.notificationType === 'memberManipulation') {
				const to = n.to._id === userId ? 'you' : `${n.to.firstName} ${n.to.lastName}`;

				return (
					<ListItem key={i}>
						<ListItemAvatar>
							<Avatar src={n.from?.image?.url} />
						</ListItemAvatar>
						<ListItemText primary={`${from} ${n.content} (${to})`} secondary={`${toDate(n.createdAt)}`} />
					</ListItem>
				);
			}

			// else, the notificationType === 'projectCreations'

			const project = teamProjects.find(p => {
				return p._id === n.project;
			});

			return (
				<ListItem key={i}>
					<ListItemAvatar>
						<Avatar src={n.from?.image?.url} />
					</ListItemAvatar>
					<ListItemText
						primary={`${from} ${n.content} (${project?.name})`}
						secondary={`${toDate(n.createdAt)}`}
					/>
				</ListItem>
			);
		});
	}
	return (
		<Paper elevation={3}>
			<Typography variant='h6' className='text-center'>
				Notifications
			</Typography>

			<div id='notificationsContainer'>
				<List>{notifications}</List>

				<div
					style={{
						backgroundColor: '#11161A',
						display: 'flex',
						justifyContent: 'center',
						padding: '0.2rem'
					}}
				>
					{teamNotifications.length > 0 && (
						<Pagination
							count={paginationItemsCount}
							disabled={paginationItemsCount < 2}
							color='primary'
							onChange={(e, newPage) => props.paginateTeamNotifiactions(newPage)}
						/>
					)}
				</div>
			</div>
		</Paper>
	);
}

const mapStateToProps = state => ({ userId: state.currentUser._id });

export default connect(mapStateToProps)(TeamNotifications);
