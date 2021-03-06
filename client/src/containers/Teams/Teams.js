import React, { Component } from 'react';
import { userTeams } from '../../Apis/user';
import { withSnackbar } from 'notistack';
import Nprogress from 'nprogress';
import TeamBox from '../../components/Boxes/TeamBox';
import Modal from '../../components/Modal/Modal';
import { Add } from '@material-ui/icons';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import './Teams.scss';
import { deleteTeam, newTeam } from '../../Apis/team';
import AddTeam from './AddTeam';
import Alert from '@material-ui/lab/Alert';

export class Teams extends Component {
	state = {
		loading: false,
		teams: null,
		modalOpen: false
	};

	async componentDidMount() {
		Nprogress.start();

		try {
			await this.getTeams();

			Nprogress.done();
		} catch (error) {
			Nprogress.done();
			alert((error.response && error.response.data.erro) || 'Something went wrong, please try again later.');
		}
	}

	getTeams = async () => {
		const response = await userTeams(false);
		this.setState({ teams: response.data.teams });
	};

	openModal = () => {
		this.setState({ modalOpen: true });
	};

	closeModal = () => {
		this.setState({ modalOpen: false });
	};

	addTeam = async (e, name) => {
		e.preventDefault();

		this.setState({ loading: true });

		try {
			const body = { name };

			const response = await newTeam(body);

			await this.getTeams();

			this.setState({ loading: false });

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });
			this.closeModal();
		} catch (error) {
			this.props.enqueueSnackbar(error.response && error.response.data.error, { variant: 'error' });
			this.setState({ loading: false });
		}
	};

	removeTeam = async teamId => {
		if (window.confirm('Are you sure you wanna delete this team ?')) {
			Nprogress.start();
			try {
				const response = await deleteTeam(teamId);

				await this.getTeams();

				this.props.enqueueSnackbar(response.data.message, { variant: 'success' });

				Nprogress.done();
			} catch (error) {
				console.error(error);
				Nprogress.done();
			}
		}
	};
	render() {
		const { teams, modalOpen, loading } = this.state;
		return (
			<div>
				{teams && (
					<div>
						<div id='TeamHeader'>
							<div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>Your Teams.</div>
							<Tooltip title='New Team'>
								<Button color='primary' variant='contained' onClick={this.openModal}>
									<Add />
								</Button>
							</Tooltip>
						</div>

						<hr />
						<div className='row'>
							{teams.length > 0 ? (
								teams.map((team, i) => <TeamBox key={i} team={team} removeTeam={this.removeTeam} />)
							) : (
								<Alert severity='info' variant='standard' style={{ width: '100%' }}>
									You have not teams.
								</Alert>
							)}
						</div>
					</div>
				)}

				{modalOpen && (
					<Modal closeModal={this.closeModal} modalOpen={modalOpen} header='New Team'>
						<AddTeam loading={loading} newTeam={this.addTeam} />
					</Modal>
				)}
			</div>
		);
	}
}

export default withSnackbar(Teams);
