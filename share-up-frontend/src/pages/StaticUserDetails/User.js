import React, { Component } from 'react'
import StaticProfile from '../../components/User/UserProfile/StaticProfile';
import { Grid } from '@material-ui/core';
import Scream from '../../components/Screams/Scream';
import {connect} from 'react-redux';
import axios from 'axios';
import { getScreams } from '../../actions/actions';
import { store } from '../../store/store';
import { STATIC_USER_PROFILE, LOADING_STATIC_USER_PROFILE, LOADING_SCREAMS } from '../../actions/actionTypes';
import ScreamSkeleton from '../../utils/Skeletons/ScreamSkeleton';

class User extends Component {
    constructor(props){
        super(props);
        this.state = {
            screamIdParam: null
        }
    }
    componentDidMount() {
        const {username, screamId} = this.props.match.params;
        if(screamId){
            this.setState({screamIdParam: screamId})
        }
        store.dispatch({
            type: LOADING_STATIC_USER_PROFILE,
            payload: true
        })
        store.dispatch({
            type: LOADING_SCREAMS,
            payload: true
        })

        axios.get(`/user/details/${username}`)
            .then(res => {
                this.props.getScreams(res.data.screams);
                store.dispatch({
                    type: STATIC_USER_PROFILE,
                    payload: res.data.user
                })
            })
            .catch(err => {
                console.log(err);
                this.props.history.push('/');
            })
    }

    render(){
        const {screamIdParam} = this.state;
        let screamForMarkUp = this.props.loadingScreams ? 
            <ScreamSkeleton/> : 
            (this.props.screams.length>0 ? (!screamIdParam ? 
                (this.props.screams.map(scream=> {
                    let hasUserLikedScream;
                    if (this.props.likes.length > 0) {
                        hasUserLikedScream = this.props.likes.find(like => like.screamId === scream.screamId)
                    }
                    return <Scream key={scream.screamId} hasUserLikedScream={hasUserLikedScream} scream={scream}/>
                })) : 
                this.props.screams.map(scream=> {
                    let hasUserLikedScream;
                    if (this.props.likes.length > 0) {
                        hasUserLikedScream = this.props.likes.find(like => like.screamId === scream.screamId)
                    }
                    if(scream.screamId !== screamIdParam){
                        return <Scream key={scream.screamId} hasUserLikedScream={hasUserLikedScream} scream={scream}/>
                    }else return <Scream key={scream.screamId} hasUserLikedScream={hasUserLikedScream} scream={scream} openDialog/>
                })
                )
            :
            <p>No screams found</p>)
           

        return (
            <Grid container spacing={4}>
                <Grid item xs={12} sm={8}>
                    {screamForMarkUp}
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StaticProfile/>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        screams: state.scream.screams,
        likes: state.user.likes,
        loadingScreams: state.scream.loadingScreams
    }
}
const mapDispatchToProps = dispatchEvent => {
    return {
        getScreams: (screams) => dispatchEvent(getScreams(screams))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(User);