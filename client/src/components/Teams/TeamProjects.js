import Alert from '@material-ui/lab/Alert';
import React from 'react';
import ProjectBox from '../Boxes/ProjectBox';

function TeamProjects(props) {
	const { projects } = props;

	let projectsOfTeam = (
		<Alert severity='info' style={{ width: '100%' }}>
			This team has no projects yet
		</Alert>
	);

	if (projects.length > 0) {
		projectsOfTeam = projects.map((project, i) => (
			<ProjectBox key={i} project={project} removeProject={() => props.removeProject(project._id)} />
		));
	}

	return <div className='row'>{projectsOfTeam}</div>;
}

export default TeamProjects;
