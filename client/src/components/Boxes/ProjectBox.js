import React from 'react';
import './Box.scss';
import Paper from '@material-ui/core/Paper';
import { toDate } from '../../helpers';
import { DeleteForever, LockOutlined, Visibility } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { LockOpenOutlined } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
function ProjectBox(props) {
	const { project, userId } = props;

	let bugText = project.bugs.length === 1 ? 'Bug' : 'Bugs';

	const goToDetails = () => {
		props.history.push(`/bugtracker/project/${project._id}`);
	};

	return (
		<div className='col-sm-6 col-md-3' style={{ marginBottom: '20px' }}>
			<Paper elevation={3} className='Box'>
				<h2 className='capitalize'>{project.name}</h2>
				<h4>
					{' '}
					<span> {project.bugs.length} </span> {bugText}
				</h4>
				<p className='secondary' style={{ fontStyle: 'italic' }}>
					Created at {toDate(project.createdAt)}
				</p>
				<div className='controllers'>
					<Tooltip title='View Project' onClick={goToDetails}>
						<IconButton>
							<Visibility color='primary' />
						</IconButton>
					</Tooltip>
					{userId === project.owner && (
						<Tooltip title='Delete Project'>
							<IconButton onClick={props.removeProject}>
								<DeleteForever color='secondary' />
							</IconButton>
						</Tooltip>
					)}
				</div>
				<div className='status'>
					{project.status === 1 ? (
						<Tooltip title='Status: Closed'>
							<LockOutlined style={{ color: '#5cb85c' }} />
						</Tooltip>
					) : (
						<Tooltip title='Status: Opened'>
							<LockOpenOutlined color='secondary' />
						</Tooltip>
					)}
				</div>
			</Paper>
		</div>
	);
}

const mapStateToProps = state => ({ userId: state.currentUser && state.currentUser._id });

export default connect(mapStateToProps)(withRouter(ProjectBox));
