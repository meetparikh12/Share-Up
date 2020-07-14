import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { withStyles, Grid, Typography } from '@material-ui/core'

const styles = {
    commentImage : {
        maxWidth: '100%',
        height: 100,
        objectFit : 'cover',
        borderRadius: '50%'
    },
    commentData: {
        marginLeft: 20
    },
    invisibleSeperator: {
        border: 'none',
        margin: 4
    },
    visibleSeperator: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
    }
}

function ScreamComments({comments, classes}) {
    return (
        <Grid container>
            {comments.map((comment, index) => {
                const {body, createdAt, username, userImage} = comment;
                return (
                    <Fragment key={createdAt}>
                        <Grid item sm={12}>
                            <Grid container>
                                <Grid item sm={2}>
                                    <img src={userImage} alt="Commentor name" className={classes.commentImage}/>
                                </Grid>
                                <Grid item sm={9}>
                                    <div className={classes.commentData}>
                                        <Typography variant="h5" component={Link} to={`/users/${username}`} color="primary">{username}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                        </Typography>
                                        <hr className={classes.invisibleSeperator}/>
                                        <Typography variant="body1">{body}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        {index !== comments.length -1 && (
                            <hr className={classes.visibleSeperator}/>
                        )}
                    </Fragment>
                )
            })}
        </Grid>
    )
}
ScreamComments.defaultProps = {
    comments: []
}

export default withStyles(styles)(ScreamComments)
