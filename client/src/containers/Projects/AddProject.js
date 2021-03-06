import React, { Component } from 'react';
import Form from '../../components/Form/Form';
import { newProject } from '../../Apis/project';
import { userTeams } from '../../Apis/user';
import {withSnackbar} from 'notistack'
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	TextField
} from '@material-ui/core';
import LoadingBtn from '../../components/Btn/LoadingBtn';
export class AddProject extends Component {
	state = {
		name: '',
		teams: null,
		type: 'private',
    teamId: null,
    loading: false
	};

	changeHandler = e => {
		const value = e.target.value;
    this.setState({ [e.target.name]: value });
    return value
	};

	typeChangeHandler = async e => {
		const type = this.changeHandler(e);

		const { teams } = this.state;

		if (type === 'public' && !teams) {
      await this.fetchteams();
    }
	};

	fetchteams = async () => {
		try {
			const response = await userTeams('yes');

      const teams = response.data.teams;
			this.setState({ teams, teamId: teams[0]?._id });
		} catch (error) {
			console.error(error);
		}
  };
  


  newProject = async () => {
    this.setState({loading: true})
    try {
      
      const {name, type, teamId} = this.state;

      const body = {name, type};
      
      if( type === 'public')  body.teamId = teamId
      
      const response = await newProject(body);
      

      this.setState({loading: false})

      this.props.enqueueSnackbar(response.data.message, { variant: 'success' })
      

      setTimeout(this.navigateAfterAdding, 1000);


    } catch (error) {
    this.setState({loading: false})

      this.props.enqueueSnackbar(error.response?.data?.error || 'Something went wrong', { variant: 'error' })    }
  }


  navigateAfterAdding = () => {
    const {type, teamId} = this.state;

    if(type === 'public') {
      return this.props.history.push(`/bugtracker/teams/${teamId}`)
    }

    this.props.history.push('/bugtracker/dashboard')

  }

	render() {
		const { type, name, teams, teamId, loading } = this.state;
		return (
			<Form type='New Project'>
				<TextField
					id='outlined-basic'
					label='Name'
					variant='outlined'
					fullWidth
					value={name}
					name='name'
					onChange={this.changeHandler}
				/>
				<br />
				<br />
				{/* RADIO BUTTON */}
				<FormControl component='fieldset'>
					<FormLabel component='legend'>Project Type</FormLabel>
					<RadioGroup
						aria-label='Project Type'
						name='ProjectType'
						value={type}
						onChange={this.typeChangeHandler}
						color='primary'
					>
						<FormControlLabel
							color='primary'
							value='private'
							control={<Radio />}
							label='private'
							name='type'
						/>
						<FormControlLabel
							color='primary'
							value='public'
							control={<Radio />}
							label='public'
							name='type'
						/>
					</RadioGroup>
				</FormControl>
				<br />
				<br />
				{/* Team Selection */}
				{teams?.length > 0 &&
				type === 'public' && (
					<FormControl variant='filled' fullWidth>
						<InputLabel id='demo-simple-select-filled-label'>Select Team</InputLabel>
						<Select
							labelId='demo-simple-select-filled-label'
							id='demo-simple-select-filled'
							value={teamId}
							onChange={this.changeHandler}
							name='teamId'
							fullWidth
						>
							{teams.map((team, i) => <MenuItem value={team._id}>{team.name}</MenuItem>)}
						</Select>
					</FormControl>
				)}

        <br/>
        <br/>

        <LoadingBtn name = 'New Project' loading = {loading} func = {this.newProject} fullWidth = {true} disabled = {name.trim().length === 0}/>
			</Form>
		);
	}
}

export default withSnackbar(AddProject);
