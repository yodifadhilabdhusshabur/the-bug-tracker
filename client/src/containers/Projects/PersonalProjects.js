import React, { Component, Fragment } from 'react';
import Nprogress from 'nprogress';
import { personalProjects } from '../../Apis/user';
import ProjectBox from '../../components/Boxes/ProjectBox';
import Alert from '@material-ui/lab/Alert';
import { deleteProject } from '../../Apis/project';
import { withSnackbar } from 'notistack';
export class PersonalProjects extends Component {
	state = {
		projects: null
	};

	async componentDidMount() {
		Nprogress.start();
		try {
			await this.getPersonalProjects();
			Nprogress.done();
		} catch (error) {
			Nprogress.done();
		}
	}

	getPersonalProjects = async () => {
		const response = await personalProjects();
		this.setState({ projects: response.data.projects });
	};

	removeProject = async projectId => {
		if (window.confirm('Do you want to remove this project ?')) {
			Nprogress.start();

			try {
				const response = await deleteProject(projectId, null);

				await this.getPersonalProjects();

				this.props.enqueueSnackbar(response.data.message, { variant: 'success' });
				Nprogress.done();
			} catch (error) {
				Nprogress.done();
			}
		}
	};
	render() {
		const { projects } = this.state;

		let personalProjects;

		if (projects) {
			if (projects.length > 0) {
				personalProjects = (
					<div className='row'>
						{projects.map(project => {
							return (
								<ProjectBox
									key={project._id}
									project={project}
									removeProject={() => this.removeProject(project._id)}
								/>
							);
						})}
					</div>
				);
			} else {
				personalProjects = (
					<Alert severity='info'>You have no projects! start adding some from the navbar at the top.</Alert>
				);
			}
		}

		return (
			<Fragment>
				<div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>Your Personal Projects.</div>
				<hr />
				<div>{personalProjects}</div>
			</Fragment>
		);
	}
}

export default withSnackbar(PersonalProjects);
