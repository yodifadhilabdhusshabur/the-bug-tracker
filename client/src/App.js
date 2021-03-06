import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Outer from './components/Outer/Outer';
import { Component } from 'react';
import AOS from 'aos';
import SignUp from './containers/SignUp/SignUp';
import SignIn from './containers/SignIn/signIn';
import BugTracker from './containers/bugTracker/BugTracker';
import axios from 'axios';
import ForgetPassword from './containers/ForgetPassword/ForgetPassword';
import SubmitCode from './containers/ForgetPassword/SubmitCode';
import ChangePassword from './containers/ForgetPassword/ChangePassword';

class App extends Component {
	componentDidMount() {
		window.addEventListener('storage', this.detectTokenPlaying, false);

		AOS.init({
			offset: 120, // offset (in px) from the original trigger point
			delay: 0, // values from 0 to 3000, with step 50ms
			duration: 1200, // values from 0 to 3000, with step 50ms
			easing: 'ease', // default easing for AOS animations
			once: false, // whether animation should happen only once - while scrolling down
			mirror: true // whether elements should animate out while scrolling past them
		});
	}

	detectTokenPlaying = event => {
		// any playing with the token will get this user out.. but we have only one exception which is if the user have 2 tabs with the application opened for the same browser. this will trigger a change and will kick him out after the login because the other tab has no token... so we want to prevent the logic from kicking him out if the oldValue was null.

		if (event.key === 'token' && event.oldValue === null) return;

		if (event.key === 'token' && event.oldValue !== event.newValue) {
			this.getOut();
		}
	};

	getOut = () => {
		localStorage.removeItem('token');
		this.props.history.push('/');
	};

	static test = () => {
		alert('TESTINGs');
	};
	render() {
		const userToken = localStorage.getItem('token');

		const routes =
			userToken === null ? (
				<Switch>
					<Route path='/' exact component={Outer} />
					<Route path='/signup' exact component={SignUp} />
					<Route path='/signin' exact component={SignIn} />
					<Route path='/forgetPassword' exact component={ForgetPassword} />
					<Route path='/forgetPassword/submitCode' exact component={SubmitCode} />
					<Route path='/forgetPassword/changePassword/:slug' exact component={ChangePassword} />
					<Redirect to='/' />
				</Switch>
			) : (
				<Switch>
					<Route path='/bugtracker' component={BugTracker} />
					<Redirect to='/bugtracker/profile' />
				</Switch>
			);

		return <div id='App'>{routes}</div>;
	}
}

axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response.status === 401 && error.response.data.error === 'Token is expired') {
			localStorage.removeItem('token');
		}
		return Promise.reject(error);
	}
);

export default withRouter(App);
