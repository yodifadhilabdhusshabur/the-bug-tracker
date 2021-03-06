import React, { Component, Fragment } from 'react'
import Nprogress from 'nprogress';
import {projectDetails, projectTimeline} from '../../Apis/project'
import ProjectTimeline from '../../components/ProjectTimeline/ProjectTimeline'
import Statistics from '../../components/Statistics/Statistics'
import './ProjectDetails.scss'
import Bugs from '../../components/Bugs/Bugs';
import Modal from '../../components/Modal/Modal';
import BugDetails from '../../components/Bugs/BugDetails';
import AddBug from '../../components/Bugs/AddBug';
import EditBug from '../../components/Bugs/EditBug';
import {withSnackbar} from 'notistack'
import {fixBug, reOpenBug, newBug, editBug} from '../../Apis/bug'
import {closeOrReOpenProject} from '../../Apis/project'
import { Avatar, Paper } from '@material-ui/core';
import ToolTip from '@material-ui/core/Tooltip';
import LoadingBtn from '../../components/Btn/LoadingBtn';
import {connect} from 'react-redux'
import Alert from '@material-ui/lab/Alert';
import { socket } from '../..';
export class ProjectDetails extends Component {
  
  
  projectId = this.props.match.params.projectId;
  currentTeamId = this.props.currentTeamId
  userId = this.props.userId

  state = {
    project: null,
    projectStatistics: null,
    projectTimeline: null,
    paginationItemsCount: 0,
    modalOpen: false,
    selectedBug: null,
    loading: false,
    modalType: '',
  // 0 is opened, 0 is opened
  }

  projectId = this.props.match.params.projectId

  socketEvents = ['newPublicBug', 'publicBugFixed', 'publicBugReopened', 'projectClosingOrReopening', 'teamIsDeleted']





  async componentDidMount() {


    Nprogress.start();
    try {
      await this.getProjectDetails();
      Nprogress.done()
    } catch (error) {
      Nprogress.done()
      alert(error.response?.data?.error || 'Something Went Wrong, please try again later')
    }


    // socket events will get emitted from the server if the project.type === 'public' only
  
    socket.on('newPublicBug', data => {

      const { projectId, bug, newTimeLine, userId} = data;

      if(this.projectId === projectId && userId !== this.userId) {

        this.addNewBugForSocket(bug);
        this.updateStatisticsForSocket('newBug');
        this.newTimeLineForSocket(newTimeLine);

      }
    })

    socket.on('publicBugFixed', data => {

      const {projectId, bugId, newTimeLine, userId} = data;

      if(this.projectId === projectId && this.userId !== userId) {
        this.updateStatisticsForSocket('fixBug');
        this.bugFixedOrReopenedForSocket(bugId, 'fixed');
        this.newTimeLineForSocket(newTimeLine);
      }

    })
    

    socket.on('publicBugReopened', data => {
      const {bugId, projectId, newTimeLine, userId} = data;

      if(this.projectId === projectId && userId !== this.userId) { 
        this.updateStatisticsForSocket('reopenBug');
        this.bugFixedOrReopenedForSocket(bugId, 'reopened');
        this.newTimeLineForSocket(newTimeLine);
      }
    })

    socket.on('projectClosingOrReopening', data => {
      const {updatedStatus, projectId, userId} = data;

      if( this.projectId ===  projectId && this.userId !== userId) {
        this.updateProjectStatusForSocket(updatedStatus);
      }

    })


    socket.on('teamIsDeleted', data => {
      
      const {teamId} = data;
      if(this.currentTeamId === teamId && this.state.project.type === 'public') this.props.history.push('/bugtracker/teams')
      this.props.enqueueSnackbar('This team has been deleted by its owner', {variant: 'info'})
    })



    
  }

  // PROJECTS FUNCTIONS
  getProjectTimeLine = async (withLoading = true, page = 1) => {
    // try&catch because i will also use this function individually
    withLoading && Nprogress.start();
 
    try {

      const response = await projectTimeline(this.projectId, page);

      this.setState({projectTimeline: response.data.timeline, paginationItemsCount: response.data.paginationItemsCount})
      


      withLoading && Nprogress.done();
    } catch (error) {
      Nprogress.done()

      alert(error.response?.data?.error || 'Something Went Wrong, please try again later')
    }

  }

  getProject = async () => {
    //  no try&catch because this func will be called by other func
    await this.getProjectTimeLine(false);

    const response = await projectDetails(this.projectId);
    
    const {project, projectStatistics} = response.data;

    this.setState({project, projectStatistics})
  }

  // for getting all data
  getProjectDetails = async () => {
      await Promise.all([this.getProject(), this.getProjectTimeLine(false)])
  }

  updateProjectStatus = async () => {
    const project = {...this.state.project};
    
    this.setState({loading:true})
    
    const body = {projectId: project._id, teamId: null}
    
    if(project.type === 'public') body.teamId = this.currentTeamId;

    try {
      const response = await closeOrReOpenProject(body)  
      
      this.props.enqueueSnackbar(response.data.message || 'Something went wrong', {variant: 'success'})
      
      const updatedStatus = response.data.status;

      project.status = updatedStatus;

      this.setState({loading: false, project})

    } catch (error) {
      this.setState({loading:false})

      this.props.enqueueSnackbar(error.response.data.error || 'Something went wrong', {variant: 'error'})
    }
  }


  // BUGS FUNCTIONS
  updateBugStatus = async () => {
    const {project, selectedBug} = this.state;
  
    this.setState({loading: true})
    
    const body =  {teamId: null, bugId: selectedBug._id, projectId: project._id }

    if(project.type === 'public') body.teamId = this.currentTeamId;
    
    try {

      // fixed
     
      if(selectedBug.status === 1){
        
        await reOpenBug(body)

        this.props.enqueueSnackbar('Bug has been re opened Successfully', { variant: 'success' });

      } else {
        // buggy
        
        await fixBug(body)
        
        this.props.enqueueSnackbar('Bug has been fixed Successfully', { variant: 'success' });
      }
      
      await this.getProjectDetails(false);


      this.setState({loading: false, modalOpen: false})

    } catch (error) {
      this.props.enqueueSnackbar(error.response.data.error, { variant: 'error' });
      
      this.setState({loading: false})

    }
    
  }
  
  addBug = async (e,{name, description}) => {
    e.preventDefault();

    this.setState({loading: true})
    
    const { project } = this.state;

    const body = {name, description, projectId: project._id, teamId: null};

    if(project.type === 'public') body.teamId = this.currentTeamId;

    try {
      const response = await newBug(body);

      await this.getProjectDetails();


      this.props.enqueueSnackbar(response.data.message || 'Something went Wrong', {variant: 'success'})
    this.setState({loading: false, modalOpen: false})

    } catch (error) {
    this.setState({loading: false})

      this.props.enqueueSnackbar(error.response.data.error || 'Something went Wrong', {variant: 'error'})
    }
  }


  editBugDetails = async (e, {newName, newDescription}) => {

    e.preventDefault();

    this.setState({loading: true});

    try {
 
      const {selectedBug, project} = this.state
      
      const body = {newName, newDescription, bugId: selectedBug._id, projectId: project._id};

      const response = await editBug(body);


      await this.getProjectDetails();
      this.props.enqueueSnackbar(response.data.message, {variant:'success'})

      this.setState({loading: false, modalOpen: false})


    } catch (error) {
      this.props.enqueueSnackbar(error.response.data.error || 'Something Went Wrong', {variant:'error'})
      this.setState({loading: false})
    }
  }

  // MODAL FUNCTIONS
  openBug = (bugId, modalType) => {

    const {project} = this.state;
    
    const selectedBug = project.bugs.find(bug => bug._id === bugId);


    this.setState({ selectedBug })

    this.openModal(modalType)
  }

  openModal = modalType => {
 
    this.setState({ modalType, modalOpen: true})
  }

  closeModal = () => {
   this.setState({modalOpen: false})
  }


  goBack = () => {
    this.props.history.goBack();
  }





  // ____SOCKETS FUNCTIONS____


  addNewBugForSocket = (newBug) => {
    const project  = {...this.state.project};

    const projectBugs = [...project.bugs];

    projectBugs.unshift(newBug)

    project.bugs = projectBugs;

    this.setState({project});
  }

  bugFixedOrReopenedForSocket = (bugId, type) => {
    const project = {...this.state.project};

    const projectBugs = [...project.bugs];

    const bugIndex = projectBugs.findIndex(b => b._id === bugId);

    const bug = {...projectBugs[bugIndex]};

    bug.status = type === 'fixed' ? 1 : 0;

    projectBugs[bugIndex] = bug;

    project.bugs = projectBugs;

    this.setState({project});
  }


  updateStatisticsForSocket = (type) => {
    
    const projectStatistics = {...this.state.projectStatistics};
    
    switch (type) {
      case 'newBug':
        projectStatistics.total++
        projectStatistics.buggy++
        break;

      case 'fixBug':
        projectStatistics.fixed++
        projectStatistics.buggy--
        break;

      case 'reopenBug':
        projectStatistics.buggy++
        projectStatistics.fixed--
        break;

      default:
        console.log('nothing special')
    }



    this.setState({projectStatistics});
  }


  updateProjectStatusForSocket = (updatedStatus) => {
    const project = {...this.state.project};

    project.status = updatedStatus;

    this.setState({project});
  }


  newTimeLineForSocket = (newTimeline) => {
    const projectTimeline = [...this.state.projectTimeline];

    projectTimeline.unshift(newTimeline);

    this.setState({projectTimeline});
  }

  
  componentWillUnmount() {
    this.socketEvents.forEach(eventName => socket.removeEventListener(eventName));
  }


  render() {
    
    if(!this.currentTeamId && this.state.project?.type === 'public') this.goBack()

    const {project, projectStatistics, projectTimeline, paginationItemsCount, modalOpen, selectedBug, loading, modalType} = this.state

    return (
      <Fragment>





      {(project && projectStatistics && projectTimeline) &&
      
      <Fragment>
        {
          project.status === 1 &&
          <Alert severity="info">This project has been closed, you can`t work on it anymore, well done.</Alert>
        }
      <Paper id='ProjectIntro' elevation={3}>
      
        <h2 > 
          {project.name} | <span style={{color: project.status === 0 ? '#d9534f' : '#5cb85c'}}>  ({project.status === 0 ? 'Opened' : 'Closed'}) </span>  
        </h2>

        <ToolTip title = {<Avatar src={project.owner?.image?.url} />} >
          <h2 id='ownerH2'>Owner: {`${project.owner.firstName} ${project.owner.lastName}`}</h2>
        </ToolTip>
        {
          project.owner._id === this.userId &&
          <LoadingBtn name = {project.status === 0 ? 'close' : 're open'} loading ={loading} func={this.updateProjectStatus}/>
        }

      </Paper>

      <div>

        <div className="row">
        <div className="col-md-4">
        <ProjectTimeline timeline = {projectTimeline} paginationItemsCount = {paginationItemsCount} getProjectTimeLine = {this.getProjectTimeLine}/>

        </div>
        <div className="col-md-8" id = 'separator'>
          <div style= {{width: '100%'}}>
            <Statistics statistics = {projectStatistics}  />

          </div>

        </div>
        </div>
      <div className="row" style={{marginTop: '20px'}}>
        <div className="col-md-12">
          <Bugs openModal = {this.openModal}  bugs = {project.bugs} openBug  = {this.openBug}/>
        </div>
      </div>
      </div>

      </Fragment>
      }



      {/* Modal, will include addBug, bugDetails, editBug */}
      {modalOpen && <Modal  modalOpen = {modalOpen} header = { modalType=== ('bugDetails' || modalType === 'editBug')? `${selectedBug.name}`: modalType ==='addBug' ? 'Add Bug': null}closeModal = {() => this.closeModal()}>

       {modalType === 'bugDetails' ?
        <BugDetails updateBugStatus = {this.updateBugStatus} projectType = {project.type} selectedBug ={selectedBug} loading = {loading} />
      
        : modalType === 'addBug' ? <AddBug loading ={loading} addBug = {this.addBug}/>
        
        : modalType === 'editBug' ? <EditBug loading = {loading} selectedBug = {selectedBug}  editBugDetails = {this.editBugDetails} /> : null
      }

      </Modal>}


      </Fragment>
  )}
}

const mapStateToProps = state => ({userId: state.currentUser?._id, currentTeamId: state.currentTeamId})

export default connect(mapStateToProps)(withSnackbar(ProjectDetails))
