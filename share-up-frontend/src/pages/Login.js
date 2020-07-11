import React, { useState } from 'react'
import { Grid, withStyles, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import AppIcon from '../images/icon.png';
import axios from 'axios';

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

function Login({classes, history}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const formSubmitHandler = event => {
        event.preventDefault();
        setLoading(true);
        const userData = {email, password}
        axios.post('/user/login', userData)
            .then(res=> {
                setLoading(false);
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
                <Typography variant='h2' className={classes.pageTitle}>Login</Typography>
                <form noValidate onSubmit={formSubmitHandler}>
                    <TextField fullWidth type="email" id="email" name="email" value={email} label="Email" helperText={errors.email} error={errors.email? true: false} onChange={(event)=> setEmail(event.target.value)} className={classes.textField}/>
                    <TextField fullWidth type="password" id="password" name="password" value={password} label="Password" helperText={errors.password} error={errors.password? true: false} onChange={(event)=> setPassword(event.target.value)} className={classes.textField}/>
                    {errors.message && (<Typography variant="body2" className={classes.customError}>{errors.message}</Typography>)}
                    {loading && (<CircularProgress size={30} className={classes.progress}/>)}
                    {!loading && (<Button disabled={loading} type="submit" variant="contained" color="primary" className={classes.button}>Login</Button>)}
                </form>
            </Grid>
            <Grid item sm/>
        </Grid>
    )
}

export default withStyles(styles)(Login);