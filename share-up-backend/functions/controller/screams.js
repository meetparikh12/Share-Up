const {db} = require('../util/admin');

exports.ADD_SCREAM = (req,res)=> {
    const {body} = req.body;
    if(body.trim().length === 0){
        return res.status(400).json({body: 'Must not be empty'})
    }
    const newScream = {username: req.user.username, userImage: req.user.imageUrl, createdAt: new Date().toISOString(), body, likeCount: 0, commentCount: 0};
    db.collection('screams')
    .add(newScream)
    .then((doc)=> {
        const resScream = newScream;
        resScream.screamId = doc.id;
        res.status(201).json(resScream);
    })
    .catch((err)=> {
        res.status(500).json({error: 'Something went wrong'})
        console.log(err);
    })
}

exports.GET_ALL_SCREAMS = (req,res, next)=> {
    db.collection('screams').orderBy('createdAt', "desc").get()
    .then((data)=> {
        let screams = []
        data.forEach((doc)=> {
            screams.push({
                screamId: doc.id,
                username: doc.data().username,
                body: doc.data().body,
                createdAt: doc.data().createdAt,
                likeCount: doc.data().likeCount,
                commentCount: doc.data().commentCount,
                userImage: doc.data().userImage
            })
        })
        res.status(200).json({screams})
    })
    .catch((err)=> console.log(err))
}

exports.GET_SINGLE_SCREAM = (req,res,next) => {
    const {screamId} = req.params;
    let screamData = {};
    db.doc(`/screams/${screamId}`).get()
        .then((doc)=> {
            if(!doc.exists){
                return res.status(404).json({message: 'Scream Not Found'})
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db.collection('comments').where('screamId', '==', screamId).orderBy('createdAt', 'desc').get()
        })
        .then((data)=> {
            screamData.comments = [];
            data.forEach((doc)=> {
                screamData.comments.push(doc.data())
            })
            return res.status(200).json(screamData);
        })
        .catch(err => {
            return res.status(500).json({error: err.code})
        })
}

exports.COMMENT_ON_SCREAM = (req,res,next)=> {
    const {screamId} = req.params;
    const {body} = req.body;
    if(body.trim().length === 0){
        return res.status(400).json({comment: 'Comment must not be empty'})
    }
    const newComment = {
        createdAt: new Date().toISOString(),
        username: req.user.username,
        userImage: req.user.imageUrl,
        screamId,
        body
    }
    db.doc(`/screams/${screamId}`).get()
        .then((doc)=> {
            if(!doc.exists){
                return res.status(404).json({message: 'Scream Not Found'})
            }
            return doc.ref.update({commentCount: doc.data().commentCount + 1});
        })
        .then(()=> {
            return db.collection('comments').add(newComment);
        })
        .then(()=> {
            return res.status(200).json(newComment);
        })
        .catch((err)=> {
            return res.status(500).json({error: err})
        })
     
}

exports.LIKE_SCREAM = (req,res,next)=> {
    const {screamId} = req.params;
    const likes= {};
    const likeDocument = db.collection('likes').where('username', '==', req.user.username).where('screamId', '==', screamId).limit(1);
    const screamDocument = db.doc(`/screams/${screamId}`);
    let screamData = {};
    screamDocument.get()
        .then((doc)=> {
            if(doc.exists){
                likes.screamId = doc.id;
                likes.username = req.user.username;
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get()
            }else {
                return res.status(404).json({message: 'Scream not found'})
            }
        })
        .then((data)=> {
            if(data.empty){
                db.collection('likes')
                .add(likes)
                .then(()=> {
                    return screamDocument.update({likeCount: ++screamData.likeCount});
                })
                .then(()=> {
                    return res.status(200).json(screamData);
                })  
            } else {
                return res.status(400).json({message: "Scream is already liked"})
            }
        })
        .catch((err)=> {
            return res.status(500).json({error: err.code})
        })
}

exports.UNLIKE_STREAM = (req,res,next) => {
    const {screamId} = req.params;
    const likeDocument = db.collection('likes').where('username', '==', req.user.username).where('screamId', '==', screamId).limit(1);
    const screamDocument = db.doc(`/screams/${screamId}`)
    let screamData = {};
    screamDocument.get()
        .then(doc=> {
            if(doc.exists){
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get();
            }else {
                return res.status(404).json({message: 'Scream not found'});
            }
        })
        .then(data=> {
            if(data.empty){
                return res.status(400).json({message: 'Scream is not yet liked'})
            }
            db.doc(`/likes/${data.docs[0].id}`).delete()
                .then(()=> {
                    return screamDocument.update({likeCount: --screamData.likeCount});
                })
                .then(()=> {
                    return res.status(200).json(screamData);
                })
        })
        .catch(err=> {
            return res.status(500).json({error: err.code})
        })
}

exports.DELETE_SCREAM = (req,res,next)=> {
    const {screamId} = req.params;
    db.doc(`/screams/${screamId}`).get()
    .then(doc=> {
        if(doc.exists){
            if(doc.data().username===req.user.username){
                return doc.ref.delete()
            }else {
                return res.status(401).json({message: 'Not Authorized'})
            }
        } 
        return res.status(404).json({error: 'Scream not found'})
    })
    .then(()=> {
        return res.status(200).json({message: 'Scream deleted successfully.'})
    })
    .catch(err=> {
        return res.status(500).json({error: err.code})
    })
}