const functions = require('firebase-functions');
const express = require('express');
const app = express();
const usersRoute = require('./routes/users');
const screamsRoute = require('./routes/screams');
const {db} = require('./util/admin');
const cors = require('cors');
app.use(cors());

app.use('/scream', screamsRoute);
app.use('/user', usersRoute);

app.use((req, res, next) => {
    const error = new Error('Specified route does not exist');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const message = error.message || 'Unknown Error Occured';
    const status = error.status || 500;
    res.status(status).json({
        message
    })
});

exports.api = functions.https.onRequest(app);

exports.createNotificationsOnLike = functions.firestore.document('/likes/{id}')
    .onCreate(async snapshot=> {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
                .then(doc=> {
                    if(doc.exists && (doc.data().username !== snapshot.data().username)){
                        return db.doc(`/notifications/${snapshot.id}`).set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().username,
                            sender: snapshot.data().username,
                            read: false,
                            screamId: doc.id,
                            type: 'like'
                        })
                    }
                })
                .catch((err)=> {
                    console.log(err);
                    return;
                })
})

exports.deleteNotificationsOnUnlike = functions.firestore.document('/likes/{id}')
    .onDelete(snapshot=> {
        return db.doc(`/notifications/${snapshot.id}`).delete()
            .catch(err=> {
                console.log(err);
                return;
            })
    })

exports.createNotificationsOnComment = functions.firestore.document('/comments/{id}')
    .onCreate(snapshot => {
        return db.doc(`/screams/${snapshot.data().screamId}`).get()
                .then(doc=>{
                    if(doc.exists && (doc.data().username !== snapshot.data().username)){
                        return db.doc(`/notifications/${snapshot.id}`).set({
                            createdAt: new Date().toISOString(),
                            recipient: doc.data().username,
                            sender: snapshot.data().username,
                            read: false,
                            screamId: doc.id,
                            type: 'comment'
                        })
                    }
                })
                .catch(err=>{
                    console.log(err);
                    return;
                })
    })

exports.onUserImageChange = functions.firestore.document('/users/{userId}')
    .onUpdate((change)=> {
        if(change.before.data().imageUrl !== change.after.data().imageUrl){
            let batch = db.batch();
            return db.collection('comments').where('username', '==', change.before.data().username).get()
                .then(data=> {
                    data.forEach(doc=> {
                        const commentDocument = db.doc(`/comments/${doc.id}`)
                        batch.update(commentDocument, {userImage: change.after.data().imageUrl})
                    })
                    return db.collection('screams').where('username', '==', change.before.data().username).get()
                })
                .then(data=> {
                    data.forEach(doc=> {
                        const screamDocument = db.doc(`/screams/${doc.id}`)
                        batch.update(screamDocument, {userImage: change.after.data().imageUrl})
                    })
                    return batch.commit();
                })
        } else return true;
})

exports.onScreamDelete = functions.firestore.document('/screams/{screamId}')
    .onDelete((snapshot, context)=> {
        const screamId = context.params.screamId
        const batch = db.batch();
        return db.collection('likes').where('screamId', '==', screamId).get()
                .then(data=> {
                    data.forEach(doc=> {
                        const likeDocument = db.doc(`/likes/${doc.id}`)
                        batch.delete(likeDocument);
                    })
                    return db.collection('comments').where('screamId', '==', screamId).get()
                })
                .then(data => {
                    data.forEach(doc => {
                        const commentDocument = db.doc(`/comments/${doc.id}`)
                        batch.delete(commentDocument);
                    })
                    return db.collection('notifications').where('screamId', '==', screamId).get()
                })
                .then(data => {
                    data.forEach(doc => {
                        const notificationDocument = db.doc(`/notifications/${doc.id}`)
                        batch.delete(notificationDocument);
                    })
                    return batch.commit();
                })
                .catch(err=> {
                    console.log(err);
                })
                
    })