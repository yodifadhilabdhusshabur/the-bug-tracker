import {
	Avatar,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	TextField
} from '@material-ui/core';
import React, { Component, Suspense } from 'react';
import { findUserWithPrivateKey } from '../../Apis/user';
import { withSnackbar } from 'notistack';
import './Teams.scss';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
export class AddMembers extends Component {
	state = {
		membersToAdd: [],
		loading: false,
		userKey: '',
		foundUser: null
	};

	getMember = async () => {
		this.setState({ loading: true });
		try {
			const { userKey } = this.state;

			const response = await findUserWithPrivateKey(userKey, this.props.teamId);

			this.setState({ loading: false, foundUser: response.data.user, userKey: '' });

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });
		} catch (error) {
			this.setState({ loading: false });
			this.props.enqueueSnackbar((error.response && error.response.data.error) || 'Something went wrong', {
				variant: 'error'
			});
		}
	};

	removeFromList = memberId => {
		const { membersToAdd } = this.state;

		const membersToAddCopy = [ ...membersToAdd ];

		const updatedMembers = membersToAddCopy.filter(member => member._id !== memberId);

		this.setState({ membersToAdd: updatedMembers });
	};

	addToList = () => {
		const { foundUser, membersToAdd } = this.state;

		const sameUser = membersToAdd.find(member => member._id === foundUser._id);

		if (sameUser) return this.props.enqueueSnackbar('This user is already in your list', { variant: 'error' });

		const updatedMembers = [ ...membersToAdd ];

		updatedMembers.push(foundUser);

		this.setState({ membersToAdd: updatedMembers, foundUser: null });
	};

	changeHandler = e => {
		this.setState({ userKey: e.target.value });
	};

	render() {
		// we will have outerLoading and innerLoading
		const { loading, foundUser, userKey, membersToAdd } = this.state;
		const { outerLoading } = this.props;
		return (
			<div>
				<div id='addMembers'>
					{/* Added Members section */}
					<div className='membersListSection'>
						<h2>Your Members List:</h2>
						<div>
							{membersToAdd.length > 0 &&
								membersToAdd.map((member, i) => {
									return (
										<ListItem key={i}>
											<ListItemAvatar>
												<Avatar src={member.image && member.image.url} />
											</ListItemAvatar>
											<ListItemText
												style={{ textTransform: 'capitalize' }}
												primary={`${member.firstName} ${member.lastName}`}
											/>
											<ListItemSecondaryAction>
												<IconButton
													edge='end'
													aria-label='delete'
													onClick={() => this.removeFromList(member._id)}
												>
													<DeleteIcon color='secondary' />
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
									);
								})}
						</div>
					</div>

					{/* found user section */}
					<div className='findSection'>
						<TextField
							id='outlined-basic'
							label='User Key'
							variant='outlined'
							onChange={this.changeHandler}
							fullWidth
							value={userKey}
						/>
						<br />
						<br />

						<LoadingBtn
							name='find'
							loading={loading}
							disabled={userKey.trim() === ''}
							func={this.getMember}
						/>
						{foundUser && (
							<div className='foundUser'>
								<ListItem>
									<ListItemAvatar>
										<Avatar src={foundUser.image && foundUser.image.url} />
									</ListItemAvatar>
									<ListItemText
										style={{ textTransform: 'capitalize' }}
										primary={`${foundUser.firstName} ${foundUser.lastName}`}
									/>
									<ListItemSecondaryAction>
										<IconButton edge='end' aria-label='add' onClick={this.addToList}>
											<AddIcon color='primary' />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							</div>
						)}
					</div>
				</div>
				<LoadingBtn
					name='add members'
					loading={outerLoading}
					func={() => this.props.addMembersToTeam(membersToAdd)}
					fullWidth={true}
					disabled={membersToAdd.length === 0}
				/>
			</div>
		);
	}
}

export default withSnackbar(AddMembers);
