import React from 'react';
import { withStyles, Paper, Typography, IconButton, Tooltip } from '@material-ui/core';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import dayjs from 'dayjs';
import axios from 'axios';
import getAuthenticatedUserDetails from '../utils/getAuthenticatedUserDetails';
import { store } from '../store/store';
import { UNAUTHENTICATE_USER } from '../actions/actionTypes';
import setFbToken from '../utils/setFbToken';
import EditDetails from './EditDetails';
import ProfileSkeleton from './ProfileSkeleton';

const styles = {
    paper: {
        padding: 20
    }, 
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '73%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: '#00bcd4'
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0'
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    }, 
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }
}
function Profile(props) {
    const {classes, user: {credentials: {username,imageUrl, createdAt, bio, location}, loadingUserDetails}} = props;
    
    const handleImage = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image);
        const token = localStorage.getItem('FBToken');
        axios.post('/user/image', formData)
            .then(()=> {
                getAuthenticatedUserDetails(token);
            })
            .catch(err=> console.log(err));
    }

    const handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    }

    const handleLogout = () => {
        store.dispatch({
            type: UNAUTHENTICATE_USER
        })
        setFbToken(false);
        localStorage.removeItem('FBToken')
    }

    let profileMarkUp = !loadingUserDetails ? (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={imageUrl} className="profile-image" alt="Profile Pic"></img>
                    <input type="file" id="imageInput" onChange={handleImage} hidden="hidden"/>
                    <Tooltip title="Edit Profile Picture" placement="top">
                        <IconButton onClick={handleEditPicture} className="button">
                            <EditIcon color="primary"/>
                        </IconButton>
                    </Tooltip>
                </div>
                <hr/>
                <div className="profile-details">
                    <Typography component={Link} to={`/user/${username}`} color="primary" variant="h5">@{username}</Typography>
                    <hr/>
                    {bio && <Typography variant="body2">{bio}</Typography>}
                    <hr/>
                    {location && (
                        <React.Fragment>
                            <LocationOn color="primary"/> <span>{location}</span>
                            <hr/>
                        </React.Fragment>
                        )}
                    <CalendarToday color="primary"/>{' '}<span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                </div>
                <Tooltip title="Logout" placement="top">
                    <IconButton onClick={handleLogout}> 
                        <KeyboardReturn color="primary"/>
                    </IconButton>
                </Tooltip>
                <EditDetails/>
            </div>
        </Paper>
    ) : (<ProfileSkeleton/>)
    return profileMarkUp;
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, null)(withStyles(styles)(Profile))