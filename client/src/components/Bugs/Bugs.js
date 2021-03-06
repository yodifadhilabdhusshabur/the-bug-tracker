import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import { toDate } from '../../helpers';
import IconButton from '@material-ui/core/IconButton';
import { Add, Visibility, Edit } from '@material-ui/icons';
import { connect } from 'react-redux';
const useStyles = makeStyles({
	table: {
		minWidth: 650
	}
});

function Bugs(props) {
	const classes = useStyles();

	const { bugs } = props;

	const sortedBugs = bugs.slice().sort((a, b) => a.status - b.status);

	return (
		<Paper elevation={3} style={{ padding: '10px' }}>
			<div
				className='TableControllers'
				style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}
			>
				<Typography variant='h6' style={{ textAlign: 'center' }}>
					Bugs
				</Typography>
				{/* AddBug */}
				<IconButton
					onClick={() => {
						props.openModal('addBug');
					}}
				>
					<Add color='primary' />
				</IconButton>
			</div>
			<TableContainer component={Paper} style={{ width: '100%' }}>
				<Table className={classes.table} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell align='center'>Name</TableCell>
							<TableCell align='center'>Status</TableCell>
							<TableCell align='center'>CreatedAt</TableCell>
							<TableCell align='center'>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedBugs.map((bug, i) => {
							return (
								<TableRow key={i}>
									<TableCell align='center' component='th' scope='row'>
										{bug.name}
									</TableCell>
									<TableCell
										align='center'
										style={{ color: bug.status === 1 ? '#5cb85c' : '#d9534f' }}
									>
										{bug.status === 1 ? 'Fixed' : 'Buggy'}
									</TableCell>
									<TableCell align='center'>{toDate(bug.createdAt)}</TableCell>
									<TableCell align='center'>
										<IconButton
											onClick={() => {
												props.openBug(bug._id, 'bugDetails');
											}}
										>
											<Visibility color='primary' />
										</IconButton>
										{props.userId === bug.creator._id && (
											<IconButton
												onClick={() => {
													props.openBug(bug._id, 'editBug');
												}}
											>
												<Edit color='primary' />
											</IconButton>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
}

const mapStateToProps = state => ({ userId: state.currentUser._id });

export default connect(mapStateToProps)(Bugs);
