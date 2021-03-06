import React from 'react';
import './Footer.scss';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
function Footer() {
	return (
		<footer id='Author'>
			<h2> &#169; All Rights Reserved to Mustafa Mahmoud</h2>
			<div>
				<a
					href='https://www.linkedin.com/in/mustafa-mahmoud-a80a221b4/'
					rel='noopener noreferrer'
					target='_blank'
				>
					<LinkedInIcon style={{ color: '#0077B5', fontSize: '50px' }} />
				</a>

				<a href='https://github.com/Mustafa-Mahmoud-5' rel='noopener noreferrer' target='_blank'>
					<GitHubIcon style={{ color: 'black', fontSize: '50px' }} />
				</a>
			</div>
		</footer>
	);
}

export default Footer;
