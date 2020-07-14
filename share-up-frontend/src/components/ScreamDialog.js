import React, { Fragment, useState } from 'react'
import { Tooltip, IconButton, Dialog, CircularProgress, DialogContent, Grid, Typography, withStyles } from '@material-ui/core'
import UnfoldMore from '@material-ui/icons/UnfoldMore'
import CloseIcon from '@material-ui/icons/Close'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import axios from 'axios'
import {connect} from 'react-redux'
import { getSingleScream } from '../actions/actions'

const styles = {
    invisibleSeperator: {
        border: 'none',
        margin: 4
    },
    profileImage: {
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    }, 
    dialogContent: {
        padding: 20
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    progress: {
        textAlign: 'center'
    }
}
function ScreamDialog({classes, screamId, getSingleScream, scream: {username, likeCount, commentCount, comments, createdAt, body, userImage, }}) {
    const [open, setIsOpen] = useState(false)
    const [loading, setIsLoading] = useState(false)

    const handleOpen = () => {
        setIsOpen(true)
        setIsLoading(true);
        axios.get(`/scream/${screamId}`)
            .then(res => {
                setIsLoading(false)
                getSingleScream(res.data)
            })
            .catch(err => {
                console.log(err)
                setIsLoading(false)
            })
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    const dialogMarkup = loading ? (
        <CircularProgress className={classes.progress} size={50}/>
    ) : (
        <Grid container spacing={10}>
            <Grid item sm={5}>
                <img src={userImage} alt="Profile" className={classes.profileImage}/>
            </Grid> 
            <Grid item sm={7}>
                <Typography component={Link} color="primary" variant="h5" to={`/users/${username}`}>@{username}</Typography>
                <hr className={classes.invisibleSeperator}/>
                <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).format('hh:mm a, MMMM DD YYYY')}
                </Typography>    
                <hr className={classes.invisibleSeperator}/>
                <Typography variant="body1">{body}</Typography>
            </Grid>
        </Grid>
           )
    return (
        <Fragment>
            <Tooltip title="More Details">
                <IconButton onClick={handleOpen}>
                    <UnfoldMore color="primary"/>
                </IconButton>
            </Tooltip>
            <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                <Tooltip title="Close" placement="top">
                    <IconButton className={classes.closeButton} onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>
                </Tooltip>
                <DialogContent className={classes.dialogContent}>
                    {dialogMarkup}
                </DialogContent>
            </Dialog>
 
        </Fragment>
    )
}
const mapStateToProps = state => {
    return {
        scream: state.scream.currentScream
    }
}
const mapDispatchToProps = dispatchEvent => {
    return {
        getSingleScream : (scream) => dispatchEvent(getSingleScream(scream))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ScreamDialog))