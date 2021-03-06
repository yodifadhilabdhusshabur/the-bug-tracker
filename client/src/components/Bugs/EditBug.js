import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import LoadingBtn from '../Btn/LoadingBtn';

class AddBug extends Component {
	state = {
		newName: this.props.selectedBug.name,
		newDescription: this.props.selectedBug.description
	};

	writeHandler = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		const { loading } = this.props;

		const { newName, newDescription } = this.state;

		return (
			<form onSubmit={e => this.props.editBugDetails(e, { newName, newDescription })}>
				<div style={{ marginBottom: '20px' }}>
					<TextField
						id='outlined-basic'
						label='Name'
						variant='outlined'
						value={newName}
						onChange={this.writeHandler}
						name='newName'
						fullWidth
						required
					/>
				</div>
				<div style={{ marginBottom: '20px' }}>
					<TextareaAutosize
						aria-label='minimum height'
						rowsMin={15}
						placeholder='Description'
						value={newDescription}
						onChange={this.writeHandler}
						name='newDescription'
						style={{ width: '100%', padding: '10px' }}
						required
					/>
				</div>

				<LoadingBtn name='Edit Bug' type='submit' loading={loading} fullWidth={true} />
			</form>
		);
	}
}

export default AddBug;
