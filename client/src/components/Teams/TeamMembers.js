import React from 'react';
import { connect } from 'react-redux';

import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
function TeamMembers(props) {
	const { userId, members, leader } = props;
	const leaderBadge = '(TEAM LEADER)';

	return (
		<div>
			{members.map((member, i) => {
				return (
					<ListItem key={i}>
						<ListItemAvatar>
							<Avatar src={member.image && member.image.url} />
						</ListItemAvatar>
						<ListItemText
							style={{ textTransform: 'capitalize' }}
							primary={`${member.firstName} ${member.lastName} ${member._id === leader._id
								? leaderBadge
								: ''}`}
						/>
						<ListItemSecondaryAction>
							{leader._id === userId &&
							leader._id !== member._id && (
								<IconButton
									edge='end'
									aria-label='delete'
									onClick={() => props.kickMemberFromTeam(member._id)}
								>
									<DeleteIcon color='secondary' />
								</IconButton>
							)}
						</ListItemSecondaryAction>
					</ListItem>
				);
			})}
		</div>
	);
}

const mapStateToProps = state => ({ userId: state.currentUser && state.currentUser._id });

export default connect(mapStateToProps)(TeamMembers);
