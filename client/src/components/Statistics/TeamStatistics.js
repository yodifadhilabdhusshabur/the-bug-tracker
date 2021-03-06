import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
function TeamStatistics(props) {
	let { statistics, Statfor } = props;
	console.log('TeamStatistics -> statistics', statistics);

	if (Statfor === 'team') {
		statistics = { ...statistics.projects, ...statistics.bugs };
	}
	const labels = [];
	const data = [];

	for (const key in statistics) {
		labels.push(key);
		data.push(statistics[key]);
	}

	const chartData = {
		labels: labels,
		datasets: [
			{
				data: data,
				backgroundColor: [ '#03a9f4', '#5cb85c', '#d9534f' ]
			}
		]
	};
	return (
		<Paper elevation={3} style={{ width: '100%', textAlign: 'center' }}>
			<Typography variant='h6' className='text-center'>
				Statistics
			</Typography>

			<div className=''>
				<Bar
					id='Dchart'
					displayTitle={true}
					data={chartData}
					height='300px'
					options={{ maintainAspectRatio: false, title: 'Project Bugs' }}
				/>
			</div>
		</Paper>
	);
}
export default TeamStatistics;
