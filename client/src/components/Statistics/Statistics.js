import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
function Statistics(props) {
	let { statistics, Statfor } = props;
	const labels = [];
	const data = [];
	let backgroundColor = [ '#03a9f4', '#5cb85c', '#d9534f' ];

	if (Statfor === 'team') {
		statistics = { ...statistics.projects, ...statistics.bugs };
		backgroundColor = backgroundColor.concat([ '#7ed6fc', '#6fe86f', '#f77f7b' ]);
	}

	console.log('Statistics -> backgroundColor', backgroundColor);
	for (const key in statistics) {
		labels.push(key);
		data.push(statistics[key]);
	}

	console.log('Statistics -> data', data);
	const chartData = {
		labels: labels,
		datasets: [
			{
				data,
				backgroundColor
			}
		]
	};
	return (
		<Paper elevation={3} style={{ width: '100%', textAlign: 'center' }}>
			<Typography variant='h6' className='text-center'>
				Statistics
			</Typography>

			<div className=''>
				<Doughnut
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

export default Statistics;
