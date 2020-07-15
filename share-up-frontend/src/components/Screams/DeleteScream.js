import DeleteOutline from '@material-ui/icons/DeleteOutline';
import {Tooltip, IconButton, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, Button, withStyles} from '@material-ui/core';
import {connect} from 'react-redux';
import React, { Fragment, useState } from 'react'
import axios from 'axios';
import { deleteScream } from '../../actions/actions';

const styles={
    deleteButton: {
        position: 'absolute',
        top: '9%',
        left: '90%'
    }
}
function DeleteScream({classes, deleteScream, screamId, username, credentials}) {
    
    const [open, setIsOpen] = useState(false);
    
    const handleOpen = ()=> {
        setIsOpen(true)
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleDeleteScream = (screamId) => {
        if(username===credentials.username){
            axios.delete(`/scream/${screamId}`)
                .then(()=> {
                    deleteScream(screamId)
                })
        } 
        handleClose();
    }

    return (
        <Fragment>
            <Tooltip title="Delete scream">
                    <IconButton className={classes.deleteButton} onClick={handleOpen}>
                        <DeleteOutline color="secondary"/>
                    </IconButton>
            </Tooltip> 
            <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                <DialogTitle>Delete Scream</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this scream? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>handleDeleteScream(screamId)} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )
}

const mapStateToProps = state => {
    return {
        credentials: state.user.credentials
    }
}
const mapDispatchToProps = dispatchEvent => {
    return {
        deleteScream: (screamId) => dispatchEvent(deleteScream(screamId))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DeleteScream));
