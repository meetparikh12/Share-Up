import React, { Fragment, useState, useEffect } from 'react'
import { Tooltip, IconButton, Dialog, CircularProgress, DialogContent, Grid, Typography, withStyles } from '@material-ui/core'
import UnfoldMore from '@material-ui/icons/UnfoldMore'
import CloseIcon from '@material-ui/icons/Close'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import axios from 'axios'
import {connect} from 'react-redux'
import { getSingleScream } from '../../../actions/actions'
import Favourite from '@material-ui/icons/Favorite';
import FavouriteBorder from '@material-ui/icons/FavoriteBorder';
import Chat from '@material-ui/icons/Chat';
import ScreamComments from '../ScreamComments/ScreamComments'
import CommentForm from '../ScreamComments/CommentForm'

const styles = {
    invisibleSeperator: {
        border: 'none',
        margin: 4
    },
    profileImage: {
        width: 200,
        height: 200,
        maxWidth: '100%',
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
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        margin: '50 0'
    },
    visibleSeperator: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
    }
}
function ScreamDialog({openDialog, username, classes, handleComment, screamLikeCount, screamCommentCount ,handleLike, handleUnlike, hasUserLikedScream ,screamId, getSingleScream, scream: { comments, createdAt, body, userImage }}) {
    const [open, setIsOpen] = useState(false)
    const [loading, setIsLoading] = useState(false)
    const [olderPath, setOldPath] = useState('')
    
    useEffect(() => {
        if(openDialog){
            handleOpen();
        }
    }, [openDialog])
    
    const handleOpen = () => {
        let oldPath = window.location.pathname;
        const newPath = `/user/${username}/scream/${screamId}`
        if(oldPath===newPath){
            oldPath=`/user/${username}`
        }
        window.history.pushState(null,null,newPath);
        setOldPath(oldPath);
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
        window.history.pushState(null,null,olderPath);
        setIsOpen(false)
    }

    const dialogMarkup = loading ? (
        <div className={classes.spinnerDiv}>
            <CircularProgress className={classes.progress} thickness={2} size={100}/>
        </div>
    ) : (
        <Grid container>
            <Grid item sm={5}>
                <img src={userImage} alt="Profile" className={classes.profileImage}/>
            </Grid> 
            <Grid item sm={7}>
                <Typography component={Link} color="primary" variant="h5" to={`/user/${username}`}>@{username}</Typography>
                <hr className={classes.invisibleSeperator}/>
                <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).format('hh:mm a, MMMM DD YYYY')}
                </Typography>    
                <hr className={classes.invisibleSeperator}/>
                <Typography variant="body1">{body}</Typography>
                {!!hasUserLikedScream ? <Tooltip title="Unlike">
                    <IconButton onClick={() => handleUnlike(screamId)}>
                        <Favourite color="primary"/>
                    </IconButton>
                </Tooltip>: <Tooltip title="Like">
                    <IconButton onClick={() => handleLike(screamId)}>
                        <FavouriteBorder color="primary"/>
                    </IconButton>
                </Tooltip>
                }
                <span>{screamLikeCount} {screamLikeCount > 1 ? "likes" : "like"}</span>
                <Tooltip title="View Comments">
                    <IconButton>
                        <Chat color="primary"/>
                    </IconButton>
                </Tooltip>
                <span>{screamCommentCount} {screamCommentCount > 1 ? "comments" : "comment"}</span>
            </Grid>
            <hr className={classes.visibleSeperator}/>
            <CommentForm handleComment={handleComment} screamId={screamId}/>
            <ScreamComments comments={comments}/>
        </Grid>
           )
    return (
        <Fragment>
            <Tooltip title="More Details">
                <IconButton className={classes.expandButton} onClick={handleOpen}>
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
