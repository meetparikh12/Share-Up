import React, { Fragment, useState, useEffect } from 'react'
import { Tooltip, IconButton, withStyles, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import {connect} from 'react-redux';
import axios from 'axios';
import getAuthenticatedUserDetails from '../utils/getAuthenticatedUserDetails';

const styles = {
    button: {
        float: 'right'
    },
    textField: {
        margin: '10px auto 10px auto'
    }
}

function EditDetails({classes, credentials}) {
    const [bio,setBio] = useState('');
    const [location, setLocation] = useState('');
    const [open, setIsOpen] = useState(false);
    // const [bioError, setBioError] = useState('');
    // const [locationError, setLocationError] = useState('');
    useEffect(()=> {
        const {bio, location} = credentials || {bio: '', location: ''};
        setBio(bio);
        setLocation(location);
    }, [])

    const handleOpen = () => {
        setIsOpen(true);
    }
    const handleClose = () => {
        setIsOpen(false);
    }
    const handleSubmit = () => {
        // if(bio.trim().length ===0){
        //     setBioError('Cannot be empty')
        // }
        const profileDetails = {bio, location}
        axios.post('/user/details', profileDetails)
            .then(()=> {
                const token = localStorage.getItem('FBToken')
                getAuthenticatedUserDetails(token)
            })
            .catch(err=> console.log(err));
        handleClose();
    }
    return (
        <Fragment>
            <Tooltip title="Edit Details" placement="top">
                <IconButton onClick={handleOpen} className={classes.button}>
                    <EditIcon color="primary"/>
                </IconButton>
            </Tooltip> 
            <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                <DialogTitle>Edit your details</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            id="bio"
                            label="Bio"
                            multiline
                            rows="3"
                            value={bio}
                            onChange={(event)=> setBio(event.target.value)}
                            type="text"
                            placeholder="A small bio about yourself"
                            fullWidth
                            className={classes.textField}
                        />
                        <TextField
                            id="location"
                            label="Location"
                            value={location}
                            placeholder="Where do you live?"
                            onChange={(event)=> setLocation(event.target.value)}
                            type="text"
                            className={classes.textField}
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Save
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
export default connect(mapStateToProps, null)(withStyles(styles)(EditDetails));
