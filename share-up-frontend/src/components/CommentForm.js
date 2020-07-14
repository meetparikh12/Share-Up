import React, { useState } from 'react'
import { Grid, TextField, Button, withStyles, CircularProgress } from '@material-ui/core'
import axios from 'axios'
import {connect} from 'react-redux'
import { addCommentToScream } from '../actions/actions'

const styles = {
    visibleSeperator: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
    },
    textField: {
        margin: '10px auto 10px auto'
    },
    button: {
        margin: 10
    },
    progress: {
        margin: 10
    }
}

function CommentForm({classes, screamId, handleComment ,addCommentToScream}) {
    const [body, setBody] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setIsLoading] = useState(false)

    const commentSubmitHandler = (event)=> {
        setIsLoading(true);
        event.preventDefault();
        axios.post(`/scream/${screamId}/comment`, {body})
            .then(res=> {
                addCommentToScream(res.data);
                setErrors({});
                handleComment();
                setIsLoading(false);
                setBody('');
            })
            .catch(err=> {
                console.log(err);
                setIsLoading(false);
                setErrors(err.response.data)
            })
    }

    return (
        <Grid item sm={12} style={{textAlign: 'center'}}>
            <form onSubmit={commentSubmitHandler}>
                <TextField name="body" type="text" label="Comment on scream" error={errors.comment ? true: false} 
                    helperText={errors.comment} value={body} onChange={(event)=> setBody(event.target.value)} fullWidth 
                    className={classes.textField}/>
                {loading ? <CircularProgress className={classes.progress} size={30}/> : <Button type="submit" variant="contained" color="primary" className={classes.button}>Add Comment</Button>}
            </form>
            <hr className={classes.visibleSeperator}/>
        </Grid>
    )
}

const mapDispatchToProps = dispatchEvent => {
    return {
        addCommentToScream: (comment)=> dispatchEvent(addCommentToScream(comment))
    }
}
export default connect(null,mapDispatchToProps)(withStyles(styles)(CommentForm));    

