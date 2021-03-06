import React, { Component } from 'react';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import { changePassword } from '../../Apis/auth';
import Form from '../../components/Form/Form';
import { withSnackbar } from 'notistack';
import { TextField } from '@material-ui/core';

export class ChangePassword extends Component {
	state = {
		loading: false,
		firstPassword: '',
		secondPassword: ''
	};

	slug = this.props.match.params.slug;

	submitHandler = async e => {
		e.preventDefault();

		this.setState({ loading: true });

    try {
		const { firstPassword, secondPassword } = this.state;

		const body = { firstPassword, secondPassword, slug: this.slug };

		const response = await changePassword(body);

		this.props.enqueueSnackbar(response.data.message, {variant: 'success'});

		setTimeout(() => {
			this.props.history.push('/');
		}, 2000);

    this.setState({loading: false}) // this will be called before the setTimeOut..
		} catch (error) {
      this.setState({loading: false})

			this.props.enqueueSnackbar(error.response?.data?.error || 'Something Went Wrong', {variant: 'error'})
		}
	};

  changeHandler = e => {
    this.setState({[e.target.name]: e.target.value});
  }


	render() {
		const { firstPassword, secondPassword, loading } = this.state;

		return (
			<Form type='Change Password'>
				<form onSubmit={this.submitHandler}>
					<TextField
						id='outlined-basic'
						name='firstPassword'
						label='Password'
						variant='outlined'
						required
						value={firstPassword}
						fullWidth
						onChange={this.changeHandler}
					/>
					<br />
					<br />
					<TextField
						id='outlined-basic'
						name='secondPassword'
						label='Confirm'
						variant='outlined'
						required
						value={secondPassword}
						fullWidth
						onChange={this.changeHandler}
					/>
					<br />
					<br />
					<LoadingBtn name='Change' fullWidth={true} loading={loading} type='submit' />
				</form>
			</Form>
		);
	}
}

export default withSnackbar(ChangePassword);
