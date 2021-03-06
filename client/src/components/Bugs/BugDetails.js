// this component will be wrapped in a modal in the projectDetails container
import { Avatar, Tooltip } from '@material-ui/core';
import React, { Fragment } from 'react';
import { toDate } from '../../helpers';
import LoadingBtn from '../Btn/LoadingBtn';
function BugDetails(props) {
	const { projectType, selectedBug, loading } = props;
	console.log('BugDetails -> selectedBug', selectedBug);

	const selectedBugStatus = selectedBug.status === 1 ? 'Fixed' : 'Buggy';
	const selectedBugStatusColor = selectedBug.status === 1 ? '#5cb85c' : '#d9534f';

	return (
		<div style={{ textAlign: 'center' }}>
			<p style={{ color: selectedBugStatusColor }}>({selectedBugStatus})</p>

			{/* show only if the project type is public */}
			{projectType === 'public' && (
				<Fragment>
					<p className='italic secondary'>
						Reported By{' '}
						{`${selectedBug.creator.firstName}  ${selectedBug.creator.lastName} at ${toDate(
							selectedBug.createdAt
						)}`}
					</p>
				</Fragment>
			)}

			{projectType === 'public' &&
			selectedBug?.fixer && (
				<Tooltip title = {<Avatar src = {selectedBug.fixer?.image?.url}></Avatar>}>

				<p style={{ color: 'lightgreen' }}>
					Bug is fixed by{' '}
					<span style={{ textTransform: 'capitalize' }}>
						{selectedBug.fixer.firstName + ' ' + selectedBug.fixer.lastName}
					</span>
				</p>
				</Tooltip>
			)}
			<div style={{ color: 'white', backgroundColor: '#11161A', marginBottom: '20px', padding: '10px' }}>
				{selectedBug.description}
			</div>

			<LoadingBtn
				loading={loading}
				name={selectedBug.status === 1 ? 'Re open' : 'Fix'}
				func={props.updateBugStatus}
			/>
		</div>
	);
}

export default BugDetails;
