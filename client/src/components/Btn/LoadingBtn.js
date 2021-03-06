import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

/*
REQUIRED PROPS
  name
  type
	loading
	disabled
*/

function LoadingBtn(props) {
	let btnData = props.name;

	if (props.loading) {
		btnData = <CircularProgress variant='indeterminate' disableShrink color='primary' size={25} thickness={4} />;
	}

	return props.type === 'submit' ? (
		<Button
			variant='contained'
			color='primary'
			fullWidth={props.fullWidth}
			type={props.type}
			disabled={props.loading || props.disabled}
		>
			{btnData}
		</Button>
	) : (
		<Button
			variant='contained'
			color='primary'
			fullWidth={props.fullWidth}
			disabled={props.loading || props.disabled}
			onClick={props.func}
		>
			{btnData}
		</Button>
	);
}

export default LoadingBtn;
