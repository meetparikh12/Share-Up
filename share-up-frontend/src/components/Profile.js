import React from 'react';
import { withStyles, Paper, Typography } from '@material-ui/core';
import {connect} from 'react-redux';
import {Link as MuiLink} from '@material-ui/core';
import { Link } from 'react-router-dom';
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';

import dayjs from 'dayjs';

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
                left: '70%'
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
    let profileMarkUp = !loadingUserDetails ? (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={imageUrl} className="profile-image" alt="Profile Pic"></img>
                </div>
                <hr/>
                <div className="profile-details">
                    <MuiLink component={Link} to={`/users/${username}`} color="primary" variant="h5">@{username}</MuiLink>
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
    ) : (<p>Loading...</p>)
    return profileMarkUp;
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, null)(withStyles(styles)(Profile))