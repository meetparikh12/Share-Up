import React from 'react'
import { withStyles, Card, CardMedia, CardContent, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

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
    const {classes, scream : {body, createdAt, likeCount, commentCount, userImage, username, screamId}} = props;
    return (
        <Card className={classes.card}>
            <CardMedia image={userImage} title="Profile Image" className={classes.image}/>
            <CardContent className={classes.content}>
                <Typography variant="h5" color="primary" component={Link} to={`/users/${username}`}>{username}</Typography>
                <Typography variant="body2" color="textSecondary">{createdAt}</Typography>
                <Typography variant="body1">{body}</Typography>
            </CardContent>
        </Card>
    )
}
export default withStyles(styles)(Scream);