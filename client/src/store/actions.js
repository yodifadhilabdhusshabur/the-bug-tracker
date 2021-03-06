import * as actionTypes from './actionTypes';
import { personalData } from '../Apis/user';


// Error and Loading actions
const start = () => ({
	type: actionTypes.start
});

const errorOccured = message => ({
	type: actionTypes.errorOccured,
	payload: {
		message
	}
});


// USER actions
const storeUserData = user => ({
	type: actionTypes.storeUserData,
	payload: {
		user
	}
});


export const updateUserData  = updatedUser => ({
	type: actionTypes.updateUserData,
	payload: {
		updatedUser
	}
})


export const fetchUser = () => {
	return async dispatch => {
		dispatch(start());
		try {
			const response = await personalData();

			dispatch(storeUserData(response?.data?.user));
		} catch (error) {
			dispatch(errorOccured(error.response?.data?.error));
		}
	};
};

// NEW KEY action
export const newKey = (updatedKey) => ({type: actionTypes.newKey, payload: {updatedKey}})

// TEAM actions
export const saveCurrentTeamId = currentTeamId => ({
	type: actionTypes.saveCurrentTeam,
	payload: {
		currentTeamId
	}
})


// FORGET PASSWORD actions

export const storeForgetedPasswordEmail = email => ({
	type: actionTypes.forgetPassword,
	payload: {
		email
	}
})

