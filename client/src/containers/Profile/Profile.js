import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import { PhotoCamera } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button'
import LoadingBtn from '../../components/Btn/LoadingBtn'
import './Profile.scss';
import {editPersonalData} from '../../Apis/user'
import {updateUserData, newKey}from '../../store/actions'
import {withSnackbar} from 'notistack'
import {regeneratePrivateKey} from '../../Apis/user'
import NProgress from 'nprogress'

export class Profile extends PureComponent {
  
  state = {
    loading: false,
  }
  

  wirteHandler = e => {
    this.setState({[e.target.name] : e.target.value})
  }

  




  newImageHandler = async e => {
  
    e.preventDefault();
    
    NProgress.start()
    

    const imageObj = e.target.files[0]

    console.log("EditProfile -> imageObj", imageObj)



    const {firstName, lastName, image} = this.props.user;

    const oldImagePublicKey = image?.publicId;


    const fd = new FormData()

    fd.set("firstName", firstName)
    fd.set("lastName", lastName)
    fd.set("oldImagePublicKey", oldImagePublicKey);
    fd.append('image',imageObj, imageObj.name);


    try {
      const response = await editPersonalData(fd);

      this.props.updateUser(response.data.user);

      NProgress.done()

			this.props.enqueueSnackbar('Image Uploaded Successfully', { variant: 'success' });
      

    } catch (error) {
			this.props.enqueueSnackbar(error.response.data.message, { variant: 'error' });
      NProgress.done()
    }
  }



  newKey = async () => {
    this.setState({loading: true})
    
    try {

      const response = await regeneratePrivateKey();
      
      this.props.newKey(response.data.newPrivateKey)


      this.props.enqueueSnackbar(response.data.message, { variant: 'success' });


      this.setState({loading: false})

    } catch (error) {
      this.setState({loading: false})

      this.props.enqueueSnackbar(error.response.data.error, { variant: 'error' });

    }
    
  }



	render() {
    const { user } = this.props;
    const {loading} = this.state;
		return (
			<div>

        <div className="row">
          <div className="col-md-4">
          <div id='profilePicWrapper'>
							{/* EDIT ICON */}
							<div className='editProfilePic'>
								<input accept='image/*' style={{ display: 'none' }} id='icon-button-file' type='file' onChange={this.newImageHandler} />
								<label htmlFor='icon-button-file'>
									<IconButton color='primary' aria-label='upload picture' component='span'>
										<PhotoCamera />
									</IconButton>
								</label>
							</div>
							{/* IMG */}
							<Avatar src={user?.image?.url} alt="Profile-Pic" id='profilePic'/>
						</div>
            {user && 
            <div className="">
                <h2 className='capitalize'>{user.firstName + ' ' + user.lastName}</h2>
                <p className='secondar'>{user?.email}</p>
                <div style={{width: '300px'}}>
                  <hr/>
                </div>

                <Button color = 'primary' variant = 'contained' onClick={() => this.props.history.push('/bugtracker/profile/edit')}>Edit</Button>
            </div>
            }
          </div>
          <div className="col-md-8">
          <h2>Private Key: <span className='secondary'> {user?.privateKey} </span></h2>
            <LoadingBtn loading = {loading} name ='New Key' func ={this.newKey}/>

          </div>
        </div>
      </div>

		);
	}}


const mapStateToProps = state => ({ user: state.currentUser });


const mapDispatchToProps = dispatch => ({
  updateUser: (updatedUser) => dispatch(updateUserData(updatedUser)),
  newKey: (updatedKey) => dispatch(newKey(updatedKey))
})

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(Profile));






