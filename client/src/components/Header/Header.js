import React from 'react';
import Button from '@material-ui/core/Button';
import Particles from '../particles';
import './Header.scss';
import OuterNav from '../OuterNav/OuterNav';
import { withRouter } from 'react-router-dom';
function header(props) {
	const goToAuth = route => {
		props.history.push(route);
	};

	return (
		<header>
			<OuterNav />
			<div id='About'>
				<Particles />
				<div className='headerBox' data-aos='fade-up'>
					<h1>
						<span className='primaryColor' variant='span'>
							THE BUG TRACKER
						</span>{' '}
						software is a free open source bug tracking application.
					</h1>

					<p className='text-md'>
						The application allows you to work in an isolated environment for tracking your personal
						projects as well as working in a realtime environment with your teams for tracking team
						projects.
					</p>

					<p className='text-md bold'>Every thing happens while working with your team is realtime.</p>
					<p className='text-md italic'>Sign up and start tracking your application bugs now.</p>
					<div className='authBox'>
						<Button
							color='primary'
							variant='contained'
							style={{ marginRight: '10px' }}
							size='large'
							onClick={() => goToAuth('/signup')}
						>
							Sign Up
						</Button>
						<Button color='primary' variant='contained' size='large' onClick={() => goToAuth('/signin')}>
							Sign In
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}

export default withRouter(header);
