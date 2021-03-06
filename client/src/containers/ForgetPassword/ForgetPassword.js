import React, { Component } from 'react';
import Form from '../../components/Form/Form';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import { TextField } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { storeForgetedPasswordEmail } from '../../store/actions';
import { forgetPassword } from '../../Apis/auth';
import Alert from '@material-ui/lab/Alert';
export class ForgetPassword extends Component {
	state = {
		email: '',
		loading: false
	};

	submitHandler = async e => {
		e.preventDefault();
		this.setState({ loading: true });
		try {
			const { email } = this.state;

			const body = { email };

			const response = await forgetPassword(body);

			this.props.storeForgetedPasswordEmail(email);

			this.props.enqueueSnackbar(response.data.message, { variant: 'success' });

			setTimeout(() => {
				this.props.history.push('/forgetPassword/submitCode');
			}, 2000);

			this.setState({ loading: false });
		} catch (error) {
			this.props.enqueueSnackbar(error.response.data.error || 'Something Went Wrong', { variant: 'error' });

			this.setState({ loading: false });
		}
	};

	changeHandler = e => {
		this.setState({ email: e.target.value });
	};

	render() {
		const { email, loading } = this.state;

		return (
			<Form type='Forget Password'>
				<Alert severity='info' fullWidth>
					We`ll send you a gmail with the verification code that is available for only 5 minutes on the given
					email.
				</Alert>

				<br />
				<form onSubmit={this.submitHandler}>
					<TextField
						id='outlined-basic'
						name='email'
						label='Email'
						variant='outlined'
						required
						value={email}
						fullWidth
						onChange={this.changeHandler}
						type='email'
					/>
					<br />
					<br />
					<LoadingBtn name='Send Email' fullWidth={true} loading={loading} type='submit' />
				</form>
			</Form>
		);
	}
}

const mapStateToProps = state => ({ loading: state.loading });

const mapDispatcheToProps = dispatch => ({
	storeForgetedPasswordEmail: email => {
		dispatch(storeForgetedPasswordEmail(email));
	}
});

export default connect(mapStateToProps, mapDispatcheToProps)(withSnackbar(ForgetPassword));
