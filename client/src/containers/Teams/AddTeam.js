import React, { Component } from 'react';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import TextField from '@material-ui/core/TextField';

export class AddTeam extends Component {
	state = {
		name: ''
	};

	writeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		const { loading } = this.props;
		const { name } = this.state;
		return (
			<form
				onSubmit={e => {
					this.props.newTeam(e, name);
				}}
			>
				<div style={{ marginBottom: '20px' }}>
					<TextField
						id='outlined-basic'
						label='Name'
						name='name'
						variant='outlined'
						value={name}
						fullWidth
						required
						onChange={this.writeHandler}
					/>
				</div>

				<LoadingBtn type='submit' fullWidth={true} loading={loading} name='Create' />
			</form>
		);
	}
}

export default AddTeam;
