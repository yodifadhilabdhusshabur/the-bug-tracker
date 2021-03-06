import React from 'react';
import './Box.scss';
import { IconButton, Paper, Tooltip } from '@material-ui/core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { DeleteForever, Visibility } from '@material-ui/icons';
function TeamBox(props) {
	const { team } = props;
	const memberWord = team.members.length === 1 ? 'Member' : 'Members';
	const projectWord = team.projects.length === 1 ? 'Project' : 'Projects';

	const goToDetails = teamId => {
		props.history.push(`/bugtracker/teams/${team._id}`);
	};

	return (
		<div className='col-md-4' style={{ marginBottom: '20px' }}>
			<Paper className='Box teamBox'>
				<h2>{team.name}</h2>
				<div style={{ marginBottom: '10px' }}>
					{team.members.length} {memberWord}
				</div>
				<div>{team.projects.length === 0 ? 'No Projects.' : `${team.projects.length} ${projectWord}`}</div>
				<p className='secondary'>
					Created by{' '}
					{team.leader._id === props.userId ? 'you' : `${team.leader.firstName} ${team.leader.lastName}`}
				</p>
				<div className='controllers'>
					<Tooltip title='view Project'>
						<IconButton onClick={goToDetails}>
							<Visibility color='primary' />
						</IconButton>
					</Tooltip>
					{team.leader._id === props.userId && (
						<Tooltip title='Delete Project'>
							<IconButton onClick={() => props.removeTeam(team._id)}>
								<DeleteForever color='secondary' />
							</IconButton>
						</Tooltip>
					)}
				</div>
			</Paper>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		userId: state.currentUser && state.currentUser._id
	};
}

export default connect(mapStateToProps)(withRouter(TeamBox));
