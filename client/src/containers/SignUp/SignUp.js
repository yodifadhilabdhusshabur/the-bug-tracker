import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Form from '../../components/Form/Form';
import { signup } from '../../Apis/auth';
import { withSnackbar } from 'notistack';
import LoadingBtn from '../../components/Btn/LoadingBtn';

export class SignUp extends Component {
	state = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		loading: false
	};

	writeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	goToSignIn = () => {
		this.props.history.push('/signin');
	};

	submitHandler = async e => {
		e.preventDefault();

		const { firstName, lastName, email, password } = this.state;

		this.setState({ loading: true });

		const body = { firstName, lastName, email, password };

		try {
			const response = await signup(body);

			this.setState({ loading: false, firstName: '', lastName: '', email: '', password: '' });

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });

			setTimeout(() => {
				this.goToSignIn();
			}, 1000);
		} catch (error) {
			this.setState({ loading: false });

			this.props.enqueueSnackbar(error.response ? error.response.data.error : 'Something Went Wrong', {
				variant: 'error'
			});
		}
	};

	render() {
		return (
			<Form type='Sign Up'>
				<form onSubmit={this.submitHandler}>
					<div className='inpWrapper'>
						<TextField
							id='outlined-basic'
							name='firstName'
							label='First Name'
							variant='outlined'
							fullWidth
							value={this.state.firstName}
							onChange={this.writeHandler}
							required
						/>
					</div>
					<div className='inpWrapper'>
						<TextField
							id='outlined-basic'
							name='lastName'
							label='Last Name'
							variant='outlined'
							fullWidth
							value={this.state.lastName}
							onChange={this.writeHandler}
							required
						/>
					</div>
					<div className='inpWrapper'>
						<TextField
							id='outlined-basic'
							name='email'
							label='Email'
							variant='outlined'
							value={this.state.email}
							fullWidth
							onChange={this.writeHandler}
							required
						/>
					</div>
					<div className='inpWrapper'>
						<TextField
							id='outlined-basic'
							name='password'
							label='Password'
							variant='outlined'
							fullWidth
							value={this.state.password}
							onChange={this.writeHandler}
							required
						/>
					</div>
					<div className='inpWrapper'>
						<LoadingBtn type='submit' name='sign up' loading={this.state.loading} fullWidth={false} />
					</div>
				</form>
			</Form>
		);
	}
}

export default withSnackbar(SignUp);
