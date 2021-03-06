import React, { Component, Fragment } from 'react';
import { addMembers, kickMember, teamNotifications, teamDetails } from '../../Apis/team';
import {deleteProject} from '../../Apis/project';
import Modal from '../../components/Modal/Modal';
import Nprogrss from 'nprogress';
import Notifications from '../../components/Teams/TeamNotifications';
import { withSnackbar } from 'notistack';
import { Button, Tooltip } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Statistics from '../../components/Statistics/Statistics';
import TeamProjects from '../../components/Teams/TeamProjects';
import { connect } from 'react-redux';
import { saveCurrentTeamId } from '../../store/actions';
import TeamMembers from '../../components/Teams/TeamMembers';
import AddMembers from './AddMembers';
import {socket} from '../../index'
import './Teams.scss'
export class TeamDetails extends Component {
	state = {
		loading: false,
		teamStatistics: null,
		team: null, // {name, leader, members: [], projects: { bugs: [ { _id, status } ] } }
		teamNotifications: null,
		paginationItemsCount: 0,
		modalOpen: false,
		modalType: ''
	};

	teamId = this.props.match.params.teamId;
	userId = this.props.userId


	socketListeners = ['newMembersForTeam', 'userHasKicked', 'newPublicBug', 'publicBugFixed', 'publicBugReopened', 'newTeamProject', 'projectClosingOrReopening', 'teamIsDeleted', 'leaderKickedProjectOwner']

	async componentDidMount() {
		Nprogrss.start();

		try {
			await this.getTeamData();

			Nprogrss.done();
		} catch (error) {
			Nprogrss.done();

			this.props.enqueueSnackbar(
				error.response && (error.response.data.error || 'Something went wrong', { variant: 'error' })
			);
		}
		
		socket.on('newMembersForTeam', data => {
			
			const {teamMembers,team,newTeamNotifications,usersToAdd, leaderId } = data;
			
			
			if(teamMembers.includes(this.userId) && this.teamId === team._id && this.userId !== leaderId) {
				this.increaseTeamMembers(usersToAdd);
				this.updateTeamNotifications(newTeamNotifications, 'add');
			}
			
		})
		
		socket.on('userHasKicked', async data => {
			
			const {newTeamNotification, team, kickedUser, leaderId, projectLeaderIsKicked} = data;
			
			
			if(team._id === this.teamId && leaderId !== this.userId ) {

				if(projectLeaderIsKicked) {

					return await this.getTeamData()
				}
				
				if(this.userId === kickedUser) return this.props.history.push('/bugTracker/teams');
				
				this.updateTeamNotifications(newTeamNotification, 'remove');
				
				this.decreaseTeamMembers(kickedUser);
				
			}
		})
		
		socket.on('newPublicBug', data => {
			
			const {teamId, projectId} = data;
			
			if(this.teamId === teamId) { 
				this.updateBugStatistics('newPublicBug', projectId)
			}
		})
		
		socket.on('publicBugFixed', data => {
			const {teamId} = data;
			if(this.teamId === teamId) {
				this.updateBugStatistics('publicBugFixed')
			}
		})
		
		socket.on('publicBugReopened', data => {
			const {teamId} = data;
			
			if(teamId === this.teamId)  {
				this.updateBugStatistics('publicBugReopened')
			}
		})
		
		socket.on('newTeamProject', data => {
			
			const {newTeamNotification, project, teamId} = data;
			
			if(teamId === this.teamId) {
				this.newProjectForTeam(project);
				this.updateTeamNotifications(newTeamNotification, 'addProjectNotification');
				this.updateProjectsStatistics('newProject');
			}
		})
		
		socket.on('projectClosingOrReopening', data => {
			const {teamId, newTeamNotification, updatedStatus, projectId} = data;
			
			if(this.teamId === teamId) {
				
				this.updateProjectStatusForTeam(projectId, updatedStatus)
				this.updateTeamNotifications(newTeamNotification, 'addProjectNotification')
				this.updateProjectsStatistics('projectOpenedOrClosed', updatedStatus);
				
			}
		})
		
		


		socket.on('teamIsDeleted', data => {
			const {teamId} = data;
			if(teamId === this.teamId) this.props.history.push('/bugtracker/teams');
		})
		
	}
		
		
		
		getTeamData = async () => {
			await Promise.all([ this.getTeam(), this.getTeamNotifications() ]);
		};
		
		getTeam = async () => {
			const response = await teamDetails(this.teamId);
			
			this.props.saveCurrentTeamId(response.data.team._id);
			
			this.setState({ team: response.data.team, teamStatistics: response.data.teamStatistics });
		};
		
		getTeamNotifications = async () => {
			const response = await teamNotifications(this.teamId, 1);
			
			this.setState({
				teamNotifications: response.data.notifications,
				paginationItemsCount: response.data.paginationItemsCount
			});
	};

	paginateTeamNotifiactions = async (page = 1) => {
		Nprogrss.start();
		try {
			const response = await teamNotifications(this.teamId, page);

			this.setState({
				teamNotifications: response.data.notifications,
				paginationItemsCount: response.data.paginationItemsCount
			});

			Nprogrss.done();
		} catch (error) {
			this.props.enqueueSnackbar(error.reponse.data.error || 'Something went wrong', { variant: 'error' });

			Nprogrss.done();
		}
	};

	openModal = modalType => {
		this.setState({ modalOpen: true, modalType });
	};

	closeModal = () => {
		this.setState({ modalOpen: false });
	};

	kickMemberFromTeam = async memberId => {
		const teamId = this.teamId;

		Nprogrss.start();
		const body = { teamId, memberId };

		try {
			const response = await kickMember(body);

			await this.getTeamData();

			Nprogrss.done();

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });
			// this.closeModal()
		} catch (error) {
			Nprogrss.done();
			this.props.enqueueSnackbar(error.response.data.error || 'Something Went Wrong.', { variant: 'error' });
		}
	};

	addMembersToTeam = async membersList => {
		// you will receive array of objects, map it to ids only
		const members = membersList.map(member => member._id);

		this.setState({ loading: true });
		try {
			const teamId = this.teamId;

			const body = { teamId, members };

			const response = await addMembers(body);

			await this.getTeamData();

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });
			this.setState({ loading: false });
			this.closeModal();
		} catch (error) {
			this.props.enqueueSnackbar(error.response?.data?.error || 'Something Went wring', { variant: 'error' });
			this.setState({ loading: false });
		}
	};


	removeProject = async projectId => {
		
		Nprogrss.start();

		try {
			const response = await deleteProject(projectId,this.teamId);
			await this.getTeamData();
			this.props.enqueueSnackbar(response.data.message, {variant: 'success'});
			Nprogrss.done();

		} catch (error) {
			Nprogrss.done()
		}
	}

	// SOCKETS FUNCTIONS

	
	updateTeamNotifications = (newNotifications, type) => {

		const teamNotifications  = [...this.state.teamNotifications]

		if(type === 'add') {

			
			newNotifications.forEach(notification => {
				
				teamNotifications.unshift(notification);
				
			})
			
		}


		if(type === 'remove') {
			teamNotifications.unshift(newNotifications); // at this case its only an object
		}

		if(type === 'addProjectNotification') {

			teamNotifications.unshift(newNotifications)

		}
		
		this.setState({teamNotifications: teamNotifications});
	}



	increaseTeamMembers = (newMembers) => {
		const updatedTeam = {...this.state.team};

		const teamMembers = [...updatedTeam.members]
		
		const updatedMembers = teamMembers.concat(newMembers);

		updatedTeam.members = updatedMembers;
	
		this.setState({team: updatedTeam});

	}

	decreaseTeamMembers = (kickedUser) => {
		const updatedTeam = {...this.state.team};

		const teamMembers = [...updatedTeam.members];

		const updatedTeamMembers = teamMembers.filter(mem => mem._id !== kickedUser)

		updatedTeam.members = updatedTeamMembers;

		this.setState({team: updatedTeam})

	}




	updateBugStatistics = (type, projectId) => {
		const teamStatistics = {...this.state.teamStatistics}

		const bugs = {...teamStatistics.bugs};

		if(type === 'newPublicBug') {
			
			bugs.totalBugs+=1
			bugs.buggyBugs+=1

			const team = {...this.state.team};

			const projects = [...team.projects];


			const bugProjectIndex = projects.findIndex(project => project._id === projectId);

			const bugProject = {...projects[bugProjectIndex]};

			const bugProjectBugs = [...bugProject.bugs];

			bugProjectBugs.push({_id: '11111111111111', status: 0})

			bugProject.bugs = bugProjectBugs;

			projects[bugProjectIndex] = bugProject

			team.projects = projects;

			this.setState({team})
		}

		if( type === 'publicBugFixed') {
			bugs.buggyBugs -= 1
			bugs.fixedBugs =+1
		}

		if(type === 'publicBugReopened') {
			bugs.buggyBugs +=1
			bugs.fixedBugs -=1

		}

		teamStatistics.bugs = bugs;

		this.setState({teamStatistics});

	}


	newProjectForTeam = (newProject) => {
		const team = {...this.state.team};

		const teamProjects = [...team.projects];

		teamProjects.push(newProject);

		team.projects = teamProjects;

		this.setState({team})

	}


	updateProjectStatusForTeam = (projectId, updatedStatus) => {

		const team = {...this.state.team};

		const teamProjects = [...team.projects];

		const projectIndex = teamProjects.findIndex(project => project._id === projectId);
		
		const project  = {...teamProjects[projectIndex]};

		project.status = updatedStatus;

		teamProjects[projectIndex] =  project;

		team.projects = teamProjects;

		this.setState({team})

	}



	updateProjectsStatistics = (type, updatedStatus) => {


		const teamStatistics = {...this.state.teamStatistics};

		const projects = {...teamStatistics.projects};

		if(type === 'newProject') {
			projects.totalProjects++
			projects.openedProjects++
		}

		if(type === 'projectOpenedOrClosed') {

			if(updatedStatus === 1) {
				//closed
				projects.closedProjects++
				projects.openedProjects--
			}

			if(updatedStatus === 0) {

				// opened
				projects.openedProjects++
				projects.closedProjects--

			}

		}



		teamStatistics.projects = projects;

		this.setState({teamStatistics})

	}



	componentWillUnmount() {
		this.socketListeners.forEach(eventName => socket.removeEventListener(eventName))
	}

	render() {

		const {
			team,
			teamNotifications,
			paginationItemsCount,
			teamStatistics,
			loading,
			modalOpen,
			modalType,
		} = this.state;

		const userId = this.userId;

		let leader;

		let memberWord;

		if (team) {
			for (const member of team.members) {
				if (member._id === team.leader) leader = member;
			}

			memberWord = `${team.members.length} Members`;

			if (team.members.length === 1) memberWord = `${team.members.length} Member`;
		}

		return (
			<Fragment>
				{team &&
				teamNotifications &&
				teamStatistics && (
					<Fragment>
						<div id='teamContHeader'>
							<h2 className='teamH'>
								<span>{team.name}</span> |
								<span className='teamMembers' onClick={() => this.openModal('teamMembers')}>
									{' '}
									{memberWord}
								</span>
							</h2>
							{/* Add Members Buttton */}
							{userId === team.leader && (
								<Tooltip title='Add Members'>
									<Button
										color='primary'
										variant='contained'
										size='small'
										onClick={() => this.openModal('addMembers')}
									>
										<Add />members
									</Button>
								</Tooltip>
							)}
						</div>
						<hr />
						<br />
						<br />
						<div className='row'>
							<div className='col-md-4' style={{marginBottom:'20px'}}>
								<Notifications
									
									teamProjects={team.projects}
									teamNotifications={teamNotifications}
									paginationItemsCount={paginationItemsCount}
									paginateTeamNotifiactions={this.paginateTeamNotifiactions}
								/>
							</div>
							<div className='col-md-8'>
								<Statistics statistics={teamStatistics} Statfor='team' />
							</div>
						</div>
						<div id='teamProjects'>
							<div>
								<h2>Team Projects</h2>
								<hr />
							</div>
							<TeamProjects projects={team.projects} removeProject = {this.removeProject}/>
						</div>

						{modalOpen && (
							<Modal
								modalOpen={modalOpen}
								closeModal={this.closeModal}
								header={
									modalType === 'teamMembers' ? (
										'Team Members'
									) : modalType === 'addMembers' ? (
										'Add Members'
									) : null
								}
							>
								{modalType === 'teamMembers' ? (
									<TeamMembers
										kickMemberFromTeam={this.kickMemberFromTeam}
										members={team.members}
										leader={leader}
									/>
								) : modalType === 'addMembers' ? (
									<AddMembers
										teamId={this.teamId}
										outerLoading={loading}
										addMembersToTeam={this.addMembersToTeam}
									/>
								) : null}
							</Modal>
						)}
					</Fragment>
				)}
			</Fragment>
		);
	}
}

const mapDispatchesToProps = dispatch => ({
	saveCurrentTeamId: currentTeamId => dispatch(saveCurrentTeamId(currentTeamId))
});

const mapStateToProps = state => ({ userId: state.currentUser && state.currentUser._id });

export default connect(mapStateToProps, mapDispatchesToProps)(withSnackbar(TeamDetails));
