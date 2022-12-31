const jwt=require('jsonwebtoken')
module.exports=function (req, res, next) {
const token=req.cookies['auth']
if(!token) return res.status(401).send('access denied')

try {
    const admin="malak"
    const verified=jwt.verify(token,admin)
    req.user=verified
    next()
} catch (err) {
    res.status(400).send(err)
}
};
