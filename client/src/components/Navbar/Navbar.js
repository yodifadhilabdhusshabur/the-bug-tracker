import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import Avatar from '@material-ui/core/Avatar';
import GroupIcon from '@material-ui/icons/Group';
import Badge from '@material-ui/core/Badge';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '../Modal/Modal';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {NavLink, withRouter}from 'react-router-dom'
import { toDate } from '../../helpers';
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
		display: 'flex',
		height: '100%',
		position: 'relative',
    width: '100%',

  },
	appBar: {
		backgroundColor: '#11161a',
		color: '#03a9f4',
		transition: theme.transitions.create([ 'margin', 'width' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create([ 'margin', 'width' ], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	hide: {
		display: 'none'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		backgroundColor: '#11161a',
		color: '#03a9f4',

		width: drawerWidth
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end'
	},
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
		marginLeft: -drawerWidth,
		height: '100%',
		[theme.breakpoints.down("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }

  },
	contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },  navLink: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'inline-block',
		width: '100%',
		// height: '100%'

  },
  navActive: {
    backgroundColor: '#030405',
    // color: '#101519'
  }
}));

function PersistentDrawerLeft(props) {
	const classes = useStyles();
	const theme = useTheme();
	const [ open, setOpen ] = React.useState(!(window.innerWidth < 700));
  const [notificationOpen, setNotificationOpen] = React.useState(false);

	let device = window.innerWidth < 700 ? 'mobile' : 'desktop';

	
	window.addEventListener('resize', () => {
		device = window.innerWidth < 700 ? 'mobile' : 'desktop';
	})


	const closeDrawerOnNavigation = () => {
		if (device === 'mobile') handleDrawerClose();
	}

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
  };
  
  const handleNotificationOpen = async() => {
    setNotificationOpen(true)
		await props.seeNewNotifications();
  }

  const handleNotificationClose = () =>{
    setNotificationOpen(false)
  }

	const goToAddProject = () => {
		props.history.push('/bugtracker/newProject');
	}

	const logOut = () => {
		localStorage.removeItem('token');
		props.history.push('/');
	}


	let unseen = 0;

	if(props.userNotifications?.length > 0) {
		
		
		props.userNotifications.forEach(n => {
			
			if(n.seen === false) unseen+=1
		})
		
	}
	
		
		return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position='fixed'
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}
			>
				{/* upper toolbar */}
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={handleDrawerOpen}
						edge='start'
						className={clsx(classes.menuButton, open && classes.hide)}
					>
						<MenuIcon />
					</IconButton>
					{/* NEW PROJECT */}
          <Tooltip title = 'New Project'>
					<Button color='primary' size='small' variant='contained' onClick = {goToAddProject}>
						+
					</Button>

          </Tooltip>
					{/* NOTIFIATIONS ICON*/}
					<div style={{ marginLeft: 'auto' }}>
						<Tooltip title = 'Notifications'>

						<IconButton color='primary' onClick = {handleNotificationOpen}>
							<Badge color='secondary' badgeContent={unseen} >
								<NotificationsActiveIcon color='primary' />
							</Badge>
              
						</IconButton>
						</Tooltip>
						<Tooltip title = 'Log out'>

						<IconButton color='primary' onClick = {logOut}>
							<ExitToAppIcon color='primary' />
						</IconButton>
						</Tooltip>
					</div>
				</Toolbar>
			</AppBar>

			{/* LEFT DRAWER */}
			<Drawer
				className={classes.drawer}
				variant='persistent'
				anchor='left'
				open={open}
				classes={{
					paper: classes.drawerPaper
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					{/* navigation items(sections) */}
					{[ 'Profile', 'Dashboard', 'Teams' ].map((text, index) => (
            <NavLink key = {index} to = {`/bugtracker/${text.toLowerCase()}`} activeClassName = {classes.navActive} className = {classes.navLink} onClick = {closeDrawerOnNavigation}>

						<ListItem button key={text}>
							<ListItemIcon>
								{text === 'Profile' ? (
									<Avatar color='primary' alt='image' src = {props.userImg?.url} />
								) : text === 'Dashboard' ? (
									<DashboardIcon color='primary' />
								) : text === 'Teams' ? (
									<GroupIcon color='primary' />
								) : null}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
            </NavLink>

					))}
				</List>
			</Drawer>
			{/* APPLICATION */}
			<main
				className={clsx(classes.content, {
					[classes.contentShift]: open
				})}
			>
				<div className={classes.drawerHeader} />



        
        
        <Modal modalOpen = {notificationOpen} closeModal = {handleNotificationClose} header = 'Notifications'  >

            
          {props.userNotifications?.length === 0 ? <h2 style={{textAlign:'center'}}>You have no notifications.</h2> : <List>
          {props.userNotifications?.map((n, i) => {
                return (

                  <ListItem key = {i}>
                  <ListItemAvatar>
                    <Avatar src={n.from.image?.url}/>
                  </ListItemAvatar>
                  <ListItemText
										primary={`${n.from.firstName} ${n.from.lastName} ${n.content}`}
										secondary={`${toDate(n.date)}`}
                    />
                </ListItem>
              )
              })
              }

            </List>
            }
        </Modal>



        {/* APP */}


			<div style={{height: '100%'}}>

				{props.children}

			</div>

			</main>
		</div>
	);
}

export default withRouter(PersistentDrawerLeft);