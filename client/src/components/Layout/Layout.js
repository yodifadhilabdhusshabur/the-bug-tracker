import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import { connect } from 'react-redux';
import {userNotifications, seenNotifications} from '../../Apis/user'
import {socket} from '../../index';

class Layout extends Component {

  state = {
    userNotifications: null
  }


  userId = this.props.userId

  async componentDidMount() {

    await this.getUserNotifications();

    
    socket.on('newMembersForTeam', async data => {
      const {usersToAdd} = data;
    
      const userIds = usersToAdd.map(user => user._id.toString());

      if(userIds.includes(this.props.userId)) {
    
        await this.getUserNotifications()
    
      }

    })


    socket.on('userHasKicked', async data => {
      const {kickedUser} = data;
    
      if(this.props.userId === kickedUser) await this.getUserNotifications()
    })


  }


  getUserNotifications = async  () => {
    try {
      const response = await userNotifications()
      this.setState({userNotifications: response.data.notifications})
      
    } catch (error) {
      console.error(error)
    }

  }
  seeNewNotifications = async () => {

    try {

      const {userNotifications} = this.state;
      
      let newNotifications = false;
      

      for(let n of userNotifications) {
        if(n.seen === false) newNotifications = true
        break;
      }

      
      if(newNotifications) {

        // do the quick optimistic one for user first, then go and update the db 
        this.quickSeeNewNotifications();
        
        
        await seenNotifications();
      }
      
    } catch (error) {
      console.error(error)
    }
  }
  
  quickSeeNewNotifications = () => {
    // UPDATING NESTED ARRAY OBJECTS IMMUTABILLY -_-
    const updatedNotifications = [...this.state.userNotifications];

    updatedNotifications.forEach((n, i) => {
      
      const updatedNotification = {...n};
      
      updatedNotification.seen = true;

      updatedNotifications[i] = updatedNotification;

      this.setState({userNotifications: updatedNotifications});

    })

  }

	render() {
    if(!this.userId) this.userId = this.props.userId;
    
    return (
			<div>
				<Navbar userImg={this.props.userImg} userNotifications = {this.state.userNotifications} seeNewNotifications = {this.seeNewNotifications}>
          {/* This will be the entire Application */}
					{this.props.children}
				</Navbar>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { userImg: state.currentUser?.image, userId: state.currentUser?._id };
};
export default connect(mapStateToProps)(Layout);
