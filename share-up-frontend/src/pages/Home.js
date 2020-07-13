import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import axios from 'axios'
import Scream from '../components/Scream'
import Profile from '../components/Profile'

class Home extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            screams: null
        }
    }

    componentDidMount() {

        axios.get('/scream/all')
            .then(res=> {
                this.setState({screams: res.data.screams})
            })
            .catch(err=> console.log(err))
        
    }

    render(){
        let screamForMarkUp = this.state.screams ? (
            this.state.screams.map(scream=> {
                return <Scream key={scream.screamId} scream={scream}/>
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

export default Home;