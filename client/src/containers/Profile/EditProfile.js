import React, { Component } from 'react';
import { connect } from 'react-redux';
import { editPersonalData } from '../../Apis/user';
import { updateUserData } from '../../store/actions';
import { withSnackbar } from 'notistack';
import TextField from '@material-ui/core/TextField';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import Form from '../../components/Form/Form';
export class EditProfile extends Component {
	state = {
		loading: false,
		firstName: this.props.user?.firstName,
    lastName: this.props.user?.lastName,
	};

	writeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	goToProfile = () => {
		this.props.history.push('/bugtracker/profile');
	};




	submitHandler = async e => {
		e.preventDefault();
		this.setState({ loading: true });

		try {
			const body = { firstName: this.state.firstName, lastName: this.state.lastName };

			const response = await editPersonalData(body);

			this.setState({ loading: false });

			this.props.editUser(response.data.user);

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });

			this.goToProfile();
		} catch (error) {
			this.props.enqueueSnackbar(error.response.data.error, { variant: 'error' });
			this.setState({ loading: false });
		}
	};

	componentDidMount() {
    // if the user refreshed the page, the redux store will be lost, and hence, there will no be data to put in the state.. then we need to redirect to another component to wait till the async req that get the data finish
		if (!this.state.firstName && !this.state.lastName) this.goToProfile();
	}

	render() {
		const { firstName, lastName, loading } = this.state;

		return (
			<Form>
        <form onSubmit={this.submitHandler}>


				<div style={{ color: 'white' }}>
					<div style={{ margin: '20px 0' }}>
						<TextField
							id='outlined-basic'
							label='fistName'
							name='firstName'
							variant='outlined'
							fullWidth
							onChange={this.writeHandler}
							value={firstName}
						/>
					</div>
					<div style={{ margin: '20px 0' }}>
						<TextField
							id='outlined-basic'
							label='lastName'
							name='lastName'
							variant='outlined'
							fullWidth
							onChange={this.writeHandler}
							value={lastName}
						/>
					</div>
					<LoadingBtn name='Edit' fullWidth={true} loading={loading} type = 'submit'/>
				</div>
        </form>
			</Form>
		);
	}
}

const mapStateToProps = state => ({ user: state.currentUser });

const mapDispatchesToProps = dispatch => ({ editUser: updatedUser => dispatch(updateUserData(updatedUser)) });

export default connect(mapStateToProps, mapDispatchesToProps)(withSnackbar(EditProfile));
