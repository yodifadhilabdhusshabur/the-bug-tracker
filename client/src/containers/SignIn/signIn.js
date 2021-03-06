import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Form from '../../components/Form/Form';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import { withSnackbar } from 'notistack';
import { signin } from '../../Apis/auth';
import { Link } from 'react-router-dom';
export class SignIn extends Component {
	state = {
		email: '',
		password: '',
		loading: false
	};

	gotToProfile = () => {
		this.props.history.push('/bugtracker/profile')
	}
	submitHandler = async (e, cb) => {
		e.preventDefault();

		this.setState({ loading: true });
		const { email, password } = this.state;

		const body = { email, password };

		try {
			const response = await signin(body);

			this.setState({ loading: false });

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });

			localStorage.setItem('token', response.data.token);

			cb();
		} catch (error) {
			this.setState({ loading: false });
			this.props.enqueueSnackbar(error.response?.data?.error, { variant: 'error' });
		}
	};

	writeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		return (
			<Form type='Sign In'>
				<form
					onSubmit={e => {
						this.submitHandler(e, this.gotToProfile);
					}}
				>
					<div className='inpWrapper'>
						<TextField
							type='email'
							id='outlined-basic'
							name='email'
							value={this.state.email}
							label='Email'
							variant='outlined'
							fullWidth
							required
							onChange={this.writeHandler}
						/>
					</div>
					<div className='inpWrapper'>
						<TextField
							type='password'
							id='outlined-basic'
							name='password'
							label='Password'
							variant='outlined'
							fullWidth
							required
							value={this.state.password}
							onChange={this.writeHandler}
						/>
					</div>
					<LoadingBtn loading={this.state.loading} type='submit' name='sign in' fullWidth={true} />
				</form>

					<div style={{textAlign: 'center', marginTop: '10px'}}>

				<Link to ='/forgetPassword'>Forget Password?</Link>
					</div>
			</Form>
		);
	}
}

export default withSnackbar(SignIn);
