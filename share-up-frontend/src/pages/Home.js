import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import axios from 'axios'
import Scream from '../components/Scream'
import Profile from '../components/Profile'
import {connect} from 'react-redux'
import {getScreams} from '../actions/actions'

class Home extends Component {
    
    componentDidMount() {

        axios.get('/scream/all')
            .then(res=> {
                this.props.getScreams(res.data.screams);
            })
            .catch(err=> console.log(err))
        
    }

    render(){
        
        let screamForMarkUp = this.props.screams ? (
            this.props.screams.map(scream=> {
                let hasUserLikedScream;
                if (this.props.likes.length > 0) {
                    hasUserLikedScream = this.props.likes.find(like => like.screamId === scream.screamId)
                }
                return <Scream key={scream.screamId} hasUserLikedScream={hasUserLikedScream} scream={scream}/>
            })
        ) : <p>Loading...</p>

        return (
            <Grid container spacing={4}>
                <Grid item xs={12} sm={8}>
                    {screamForMarkUp}
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Profile/>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        screams: state.scream.screams,
        likes: state.user.likes
    }
}
const mapDispatchToProps = dispatchEvent => {
    return {
        getScreams: (screams)=> dispatchEvent(getScreams(screams))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);