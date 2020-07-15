import React from 'react'
import {withStyles,Paper,Typography} from '@material-ui/core';
import {Link} from 'react-router-dom';
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import dayjs from 'dayjs';
import {connect} from 'react-redux';
import ProfileSkeleton from '../../../utils/Skeletons/ProfileSkeleton';

const styles = {
    paper: {
        padding: 20
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative'

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
        }
    }
}

function StaticProfile({classes, loadingStaticUserProfile, staticUserProfile: {username, createdAt, location, bio, imageUrl}}, props) {
    
    let profileMarkUp =  loadingStaticUserProfile ? <ProfileSkeleton/> : (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={imageUrl} className="profile-image" alt="Profile Pic"></img>
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
            </div>
        </Paper>
    ) 
    return profileMarkUp;
}

const mapStateToProps = state => {
    return {
        staticUserProfile: state.user.staticUserProfile,
        loadingStaticUserProfile: state.user.loadingStaticUserProfile
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(StaticProfile))
