import React, { Fragment, useState } from 'react'
import {connect} from 'react-redux'
import { markNotificationsRead } from '../actions/actions'
import axios from 'axios'
import { Tooltip, IconButton, Menu, Badge, MenuItem, Typography } from '@material-ui/core'
import NotificationIcon from '@material-ui/icons/Notifications'
import FavouriteIcon from '@material-ui/icons/Favorite'
import ChatIcon from '@material-ui/icons/Chat'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom'

function Notifications({notifications, markNotificationsRead}) {
    const [anchorEl, setAnchorEl] = useState(null);
    dayjs.extend(relativeTime);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onMenuOpened = () => {
        let unreadNotificationIds = notifications.filter(notif=> !notif.read).map(notif=> notif.notificationId)
        markNotificationsRead(unreadNotificationIds);
    }

    let notificationIcon;
    
    if(notifications && notifications.length>0){
        notifications.filter(notif=> !notif.read).length > 0 ? (
            notificationIcon = 
            <Badge badgeContent={notifications.filter(notif=> !notif.read).length} color="secondary">
                <NotificationIcon/>
            </Badge>
        ) : (
            notificationIcon = <NotificationIcon/>
        )
    }else {
        notificationIcon = <NotificationIcon/>
    }

    let notificationsMarkup = (notifications && notifications.length > 0) ? (
        notifications.map(notif=> {
            const verb = notif.type === 'like' ? 'liked' : 'commented on'
            const iconColor = notif.read ? 'primary' : 'secondary'
            const time = dayjs(notif.createdAt).fromNow()
            const icon = notif.type === 'like' ? 
                (<FavouriteIcon color={iconColor} style={{marginRight: 10}}/>) : 
                (<ChatIcon color={iconColor} style={{marginRight: 10}}/>)
                
            return <MenuItem key={notif.createdAt} onClick={handleClose}>
                        {icon} 
                        <Typography component={Link} to={`/user/${notif.recipient}/scream/${notif.screamId}`} color="textSecondary" variant="body1">
                            {notif.sender} {verb} your scream {time}
                        </Typography>
                    </MenuItem>
        })
    ) : (
        <MenuItem onClick={handleClose}>You have no new notifications yet</MenuItem>
    )

    return (
        <Fragment>
            <Tooltip title="Notifications">
                <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    {notificationIcon}
                </IconButton>
            </Tooltip>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onEntered={onMenuOpened}
            >
            {notificationsMarkup}
            </Menu>
        </Fragment>
    )
}

const mapStateToProps = state => {
    return {
        notifications: state.user.notifications
    }
}
const mapDispatchToProps = dispatchEvent => {
    return {
        markNotificationsRead: (notificationsIds) => {
            axios.post('/user/notifications', notificationsIds)
                .then(res=> {
                    dispatchEvent(markNotificationsRead())
                })
                .catch(err=> {
                    console.log(err);
                })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
