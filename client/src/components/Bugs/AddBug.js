import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import LoadingBtn from '../Btn/LoadingBtn';

class AddBug extends Component {
	state = {
		name: '',
		description: ''
	};

	writeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		const { loading } = this.props;

		const { name, description } = this.state;

		return (
			<form onSubmit={e => this.props.addBug(e, { name, description })}>
				<div style={{ marginBottom: '20px' }}>
					<TextField
						id='outlined-basic'
						label='Name'
						variant='outlined'
						value={name}
						onChange={this.writeHandler}
						name='name'
						fullWidth
						required
					/>
				</div>
				<div style={{ marginBottom: '20px' }}>
					<TextareaAutosize
						aria-label='minimum height'
						rowsMin={15}
						placeholder='Description'
						value={description}
						onChange={this.writeHandler}
						name='description'
						style={{ width: '100%', padding: '10px' }}
						required
					/>
				</div>

				<LoadingBtn name='Add Bug' type='submit' loading={loading} fullWidth={true} />
			</form>
		);
	}
}

export default AddBug;
