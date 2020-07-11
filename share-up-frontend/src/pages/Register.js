import React, { useState, useEffect } from 'react'
import { Grid, withStyles, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import AppIcon from '../images/icon.png';
import axios from 'axios';
import { Link } from 'react-router-dom';

const styles = {
    form: {
        textAlign: 'center'
    },
    image: {
        margin: '20px auto 0 auto'
    },
    pageTitle: {
        fontFamily: 'inherit',
        margin: '0 auto 10px auto'
    },
    textField: {
        margin: '10px auto 10px auto'        
    },
    button: {
        margin: 10
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        margin: '10px auto'
    },
    progress: {
        margin: 10
    }
}

function Register({classes, history}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const formSubmitHandler = event => {
        event.preventDefault();
        setLoading(true);
        const userData = {username, email, password, confirmPassword};
        axios.post('/user/signup', userData)
            .then(res=> {
                setLoading(false);
                localStorage.setItem('FBToken', `Bearer ${res.data.token}`);
                setErrors({});
                history.push('/')
            })
            .catch(err=> {
                setErrors(err.response.data);
                setLoading(false);
            })
    }

    return (
        <Grid container className={classes.form}>
            <Grid item sm/>
            <Grid item sm>
                <img src={AppIcon} alt="Monkey" className={classes.image}/>
                <Typography variant='h2' className={classes.pageTitle}>Sign Up</Typography>
                <form noValidate onSubmit={formSubmitHandler}>
                    <TextField fullWidth type="text" id="username" name="username" value={username} label="Username" helperText={errors.username} error={errors.username? true: false} onChange={(event)=> setUsername(event.target.value)} className={classes.textField}/>
                    <TextField fullWidth type="email" id="email" name="email" value={email} label="Email" helperText={errors.email} error={errors.email? true: false} onChange={(event)=> setEmail(event.target.value)} className={classes.textField}/>
                    <TextField fullWidth type="password" id="password" name="password" value={password} label="Password" helperText={errors.password} error={errors.password? true: false} onChange={(event)=> setPassword(event.target.value)} className={classes.textField}/>
                    <TextField fullWidth type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} label="Confirm Password" helperText={errors.confirmPassword} error={errors.confirmPassword? true: false} onChange={(event)=> setConfirmPassword(event.target.value)} className={classes.textField}/>
                    {errors.message && (<Typography variant="body2" className={classes.customError}>{errors.message}</Typography>)}
                    {loading && (<CircularProgress size={30} className={classes.progress}/>)}
                    {!loading && (<Button disabled={loading} type="submit" variant="contained" color="primary" className={classes.button}>Register</Button>)}
                    <br/>
                    <small>Already have an account? Sign In <Link to="/login">Here</Link>.</small>
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    )
}

export default withStyles(styles)(Register);