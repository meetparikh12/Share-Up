const {admin, db} = require('../util/admin');

module.exports = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1]
    } else {
        return res.status(401).json({
            message: "Not Authorized"
        })
    }
    admin.auth().verifyIdToken(token)
        .then((decodedToken) => {
            req.user = decodedToken
            return db.collection('users').where("userId", "==", req.user.uid).limit(1).get()
        })
        .then((data) => {
            req.user.username = data.docs[0].data().username;
            req.user.imageUrl = data.docs[0].data().imageUrl;
            return next();
        })
        .catch((err) => {
            return res.status(401).json({
                message: 'Not Authorized'
            })
        })
}