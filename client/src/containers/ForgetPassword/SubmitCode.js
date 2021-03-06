import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import { receivePasswordRecoveryCode } from '../../Apis/auth';
import Form from '../../components/Form/Form';
import { withSnackbar } from 'notistack';
import Alert from '@material-ui/lab/Alert';
import { TextField } from '@material-ui/core';
export class SubmitCode extends Component {
	state = {
		loading: false,
		code: ''
	};


	changeHandler = e => {
		this.setState({ code: e.target.value });
	};

	submitHandler = async e => {
		e.preventDefault();

		this.setState({ loading: true });

		try {

      const {code} = this.state;

      const {email}  = this.props;

      const body = {code, email}
      
      const response = await receivePasswordRecoveryCode(body);


      setTimeout(() => {
        this.props.history.push(`/forgetPassword/changePassword/${response.data.slug}`)

      },2000)
      
      this.setState({loading: false})
    

      this.props.enqueueSnackbar(response?.data?.message , {variant: 'success'})


    } catch (error) {
      this.props.enqueueSnackbar(error.response?.data?.error || 'Something Went Wrong', {variant: 'error'})

      this.setState({loading: false})


    }
	};
	render() {

    if(!this.props.email) this.props.history.push('/'); 

    const {loading, code} = this.state;

		return (
			<Form type='Submit Your Code'>
        
				<Alert severity='info' fullWidth>
					Please Check your code via Gmail... the code is only available for 5 minutes
				</Alert>
        <br/>
        
        <form onSubmit = {this.submitHandler}>

          <TextField
              id='outlined-basic'
              name='code'
              label='Code'
              variant='outlined'
              required
              value={code}
              fullWidth
              onChange={this.changeHandler}
              />
            <br />
            <br />
            <LoadingBtn name='Submit' fullWidth={true} loading={loading} type='submit' />
          </form>
			</Form>
		);
	}
}

const mapStateToProps = state => ({email: state.forgetPasswordEmail})

export default connect(mapStateToProps)(withSnackbar(SubmitCode));
