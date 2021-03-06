import React from 'react';
import './OuterNav.scss';
function OuterNav() {
	return (
		<div elevation={3} id='NavPaper'>
			<ul id='OuterNav'>
				<li>
					<a href='#About'>About</a>
				</li>
				<li>
					<a href='#Features'>Features</a>
				</li>
				<li>
					<a href='#Author'>Author</a>
				</li>
			</ul>
		</div>
	);
}

export default OuterNav;
