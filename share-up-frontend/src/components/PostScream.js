import React, { Fragment, useState } from 'react'
import AddIcon from '@material-ui/icons/Add'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, withStyles, Tooltip, IconButton } from '@material-ui/core'
import axios from 'axios'
import { postScream } from '../actions/actions';
import {connect} from 'react-redux';

const styles = {};

function PostScream({classes,postScream}) {
    const [open, setIsOpen] = useState(false);
    const [body,setBody] = useState("");
    const [errors,setErrors] = useState({});
    
    const handleOpen = () => {
        setIsOpen(true)
    }
    
    const handleClose = () => {
        setIsOpen(false)
        setErrors({});
    }

    const handleSubmit = () => {
        const data = {body}
        axios.post('/scream', data)
            .then(res=> {
                postScream(res.data)
                setErrors({})
                setBody("")
                handleClose();
            })
            .catch(err=> {
                setErrors(err.response.data)
            })
    }
    return (
        <Fragment>
            <Tooltip title="Post Scream" placement="top">
                <IconButton onClick={handleOpen}><AddIcon/></IconButton>
            </Tooltip>        
            <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                <DialogTitle>Post a new scream</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            id="scream"
                            label="Share Your Scream"
                            multiline
                            rows="3"
                            onChange={(event)=> setBody(event.target.value)}
                            type="text"
                            placeholder="What's on your mind?"
                            fullWidth
                            helperText={errors.body} 
                            error={errors.body? true: false}
                            className={classes.textField}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Post
                    </Button>
                </DialogActions>
            </Dialog>   
            
                   
        </Fragment>
    )
}

const mapDispatchToProps = dispatchEvent => {
    return {
        postScream: (scream) => dispatchEvent(postScream(scream))
    }
}
export default connect(null, mapDispatchToProps)(withStyles(styles)(PostScream))
