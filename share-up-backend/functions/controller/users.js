const {db, admin} = require('../util/admin');
const {firebase, firebaseConfig} = require('../util/firebase');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const isEmpty = (value)=>{
    if(value.trim().length === 0){
        return true;
    }else {
        return false;
    }
}

const isSize = (value)=> {
    if(value.trim().length < 4 || value.trim().length > 10){
        return false;
    }else {
        return true;
    }
}
const isEmailValid = (value) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(value.match(emailRegEx)){
        return true;
    }else {
        return false;
    }
}

exports.SIGNUP_USER = (req,res)=> {

    let errors = {};

    let token, userId;
    const {email, password, username, confirmPassword} = req.body;
    
    if(isEmpty(username)){
        errors.username = "Field must not be empty"
    }else {
        if(!isSize(username)){
            errors.username = "Must be between 4 to 10 characters"
        }
    }

    if(isEmpty(email)){
        errors.email = "Field must not be empty"
    }else {
        if(!isEmailValid(email)){
            errors.email = "Provide a valid email"
        }
    }

    if(isEmpty(password)){
        errors.password = "Field must not be empty"
    } else {
        if(!isSize(password)){
            errors.password = "Must be between 4 to 10 characters"
        }
    }

    if(confirmPassword !== password){
        errors.confirmPassword = "Passwords must match"
    }

    if(Object.keys(errors).length > 0){
        return res.status(422).json(errors)
    }

    const newUser = {email, password, username, confirmPassword};
    
    db.doc(`/users/${newUser.username}`).get()
    .then((doc)=> {
        if(doc.exists){
            return res.status(400).json({username: 'Username is already taken'})
        }else {
            return firebase.auth().createUserWithEmailAndPassword(email, password)
        }
    })
    .then((data)=> {
        userId = data.user.uid;
        return data.user.getIdToken()
    })
    .then((tokenId)=> {
        token = tokenId;
        const noImage = 'no-img.png';

        const userCredentials = {
            email: newUser.email,
            createdAt: new Date().toISOString(),
            username: newUser.username,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImage}?alt=media`,
            userId
        }
        return db.doc(`/users/${newUser.username}`).set(userCredentials)
    })
    .then(()=> {
        return res.status(201).json({token})
    })
    .catch((err)=> {
        if(err.code === 'auth/email-already-in-use'){
            return res.status(400).json({email: 'Email is already is use'})
        } else {
            return res.status(500).json({error: 'Something went wrong, please try again'})
        }
    })
    
}

exports.LOGIN_USER = (req,res)=> {
    let errors = {};
    const {email, password} = req.body;
    
    if(isEmpty(email)){
        errors.email = "Field must not be empty"
    }else {
        if(!isEmailValid(email)){
            errors.email = "Provide a valid email"
        }
    }

    if(isEmpty(password)){
        errors.password = "Field must not be empty"
    }

    if(Object.keys(errors).length > 0){
        return res.status(422).json(errors)
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((data)=> {
        return data.user.getIdToken()
    })
    .then((token)=> {
        return res.status(200).json({token})
    })
    .catch((err)=> {
        
        return res.status(403).json({message: 'Invalid Credentials'})
        
    })
}

exports.UPLOAD_IMAGE = (req,res,next)=> {
    const busboy = new Busboy({headers: req.headers})
    let imageFileName; 
    let imageToBeUploaded = {};
    busboy.on('file', (fieldname, file, fileName, encoding, mimetype)=> {
        if(mimetype !== "image/jpeg" && mimetype !== "image/jpg" && mimetype !== "image/png"){
            return res.status(400).json({message: 'Uh, oh! You can only upload *.jpeg, *.jpg or *.png file.'})
        }
        const fileNameArray = fileName.split('.');
        const imageExtension = fileNameArray[fileNameArray.length - 1];
        imageFileName = uuidv4() +"." +imageExtension;
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filePath, mimetype};
        file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(()=> {
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.username}`).update({imageUrl})
        })
        .then(()=>{
            return res.status(200).json({message: 'Image updated sucessfully'})
        })
        .catch((err)=> {
            return res.status(500).json({error: err.code})
        })
    });
    busboy.end(req.rawBody);
}

exports.ADD_USER_DETAILS = (req,res,next)=> {
    const {bio,location} = req.body;
    const userDetails = {bio: '', location: ''};
    if(!isEmpty(bio)){
        userDetails.bio = bio;
    }
    if(!isEmpty(location)){
        userDetails.location = location;
    }

    db.doc(`/users/${req.user.username}`).update(userDetails)
        .then(()=> {
            return res.status(201).json({message: 'User Details updated!'})
        })
        .catch((err)=> {
            return res.stauts(500).json({error: err.code})
        })
}

exports.GET_AUTHENTICATED_USER_DETAILS = (req,res,next)=> {
    const userData = {};
    db.doc(`/users/${req.user.username}`).get()
        .then((doc)=> {
            if(doc.exists){
                userData.credentials = doc.data();
                return db.collection('likes').where('username', '==', req.user.username).get()
            }
        })
        .then((data)=> {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data())
            });
            return db.collection('notifications').where('recipient','==', req.user.username).orderBy('createdAt','desc').limit(10).get()
        })
        .then((data)=> {
            userData.notifications = [];
            data.forEach(doc=> {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    screamId: doc.data().screamId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notificationId: doc.id
                })
            })
            return res.status(200).json(userData)
        })
        .catch((err)=> {
            console.log(err);
            return res.status(500).json({error: err.code});
        })
}

exports.GET_USER_DETAILS_BY_USERNAME = (req,res,next)=> {
    const userData = {};
    db.doc(`/users/${req.params.username}`).get()
        .then(doc=> {
            if(doc.exists){
                userData.user = doc.data()
                return db.collection('screams').where('username', '==', req.params.username).orderBy('createdAt', 'desc').get()
            }else {
                return res.status(404).json({message: 'User not found'})
            }
        })
        .then(data => {
            userData.screams = [];
            data.forEach(doc=> {
                userData.screams.push({...doc.data(), screamId: doc.id})
            })
            return res.status(200).json(userData);
        })
        .catch(err=> {
            console.log(err);
            return res.status(500).json({error: err.code})
        })
}

exports.MARK_NOTIFICATIONS_AS_READ = (req,res,next)=> {
    const batch = db.batch();
    (req.body).forEach(notificationId=> {
        const notification = db.doc(`notifications/${notificationId}`)
        batch.update(notification, {read: true})
    })
    batch.commit()
        .then(()=> {
            return res.status(200).json({message: 'Notifications marked as read'})
        })
        .catch(err=> {
            console.log(err);
            return res.status(500).json({error: err.code})
        })
}