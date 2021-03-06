import React from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { toDate } from '../../helpers';
import { connect } from 'react-redux';
import Pagination from '@material-ui/lab/Pagination';
// import
function ProjectTimeline(props) {
	const { timeline, paginationItemsCount } = props;

	let projectTimeline = <h2 className='secondary text-center'>Timeline is Empty.</h2>;

	// if the array has some data, sort them and map them to HTML markup or jsx.
	if (timeline.length > 0) {
		projectTimeline = timeline.map((tl, i) => {
			let from = `${tl.from.firstName} ${tl.from.lastName}`;

			if (tl.from._id === props.currentUserId) from = 'you';

			return (
				<ListItem key={i}>
					<ListItemAvatar>
						<Avatar src={tl.from.image?.url} />
					</ListItemAvatar>
					<ListItemText primary={`${from} ${tl.content} (${tl.bug.name})`} secondary={`${toDate(tl.date)}`} />
				</ListItem>
			);
		});
	}

	return (
		<div style={{ wordBreak: 'break-word' }}>
			<Paper elevation={3}>
				<Typography variant='h6' className='text-center'>
					Timeline
				</Typography>
				<div id='TimelineContainer'>
					<List>{projectTimeline}</List>
				</div>
				<div
					className='paginator'
					style={{
						backgroundColor: '#11161A',
						display: 'flex',
						justifyContent: 'center',
						padding: '0.2rem'
					}}
				>
					{timeline.length > 0 && (
						<Pagination
							count={paginationItemsCount}
							disabled={paginationItemsCount < 2}
							color='primary'
							onChange={(e, newPage) => props.getProjectTimeLine(true, newPage)}
						/>
					)}
				</div>
			</Paper>
		</div>
	);
}

const mapStateToProps = state => ({ currentUserId: state.currentUser._id });

export default connect(mapStateToProps)(ProjectTimeline);
