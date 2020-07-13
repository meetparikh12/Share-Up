import React, { useState } from 'react'
import { withStyles, Card, CardMedia, CardContent, Typography, Tooltip, IconButton } from '@material-ui/core';
import Favourite from '@material-ui/icons/Favorite';
import FavouriteBorder from '@material-ui/icons/FavoriteBorder';
import Chat from '@material-ui/icons/Chat';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import {connect} from 'react-redux';
import { modifyLikesForUser, modifyUnlikeForUser } from '../actions/actions';

const styles = {
        card: {
            display: 'flex',
            marginBottom: 20
        },
        image: {
            minWidth: 200
        },
        content: {
            padding: 25,
            objectFit: 'cover'
        }
    }


function Scream(props) {
    const {classes, scream : {body, createdAt, likeCount, commentCount, userImage, username, screamId}, hasUserLikedScream} = props;
    const [screamLikeCount, setLikeCount] = useState(likeCount);
    const [screamCommentCount, setCommentCount] = useState(commentCount);
    dayjs.extend(relativeTime);
    
    console.log(hasUserLikedScream);
    const handleLike = (screamId) => {
        axios.get(`/scream/${screamId}/like`)
            .then(()=> {
                props.modifyLikesForUser(screamId);
                setLikeCount(screamLikeCount+1);
            })
            .catch(err=> console.log(err))
    }
    const handleUnlike = (screamId) => {
        axios.get(`/scream/${screamId}/unlike`)
            .then(()=> {
                props.modifyUnlikeForUser(screamId)
                setLikeCount(screamLikeCount - 1);
            })
            .catch(err=> console.log(err))
    }
    return (
        <Card className={classes.card}>
            <CardMedia image={userImage} title="Profile Image" className={classes.image}/>
            <CardContent className={classes.content}>
                <Typography variant="h5" color="primary" component={Link} to={`/users/${username}`}>{username}</Typography>
                <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
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
            </CardContent>
        </Card>
    )
}

const mapStateToProps = state => {
    return {
        likes: state.user.likes
    }
}

const mapDispatchToProps = dispatchEvent => {
    return {
        modifyLikesForUser : (screamId) => dispatchEvent(modifyLikesForUser(screamId)),
        modifyUnlikeForUser: (screamId) => dispatchEvent(modifyUnlikeForUser(screamId))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Scream));