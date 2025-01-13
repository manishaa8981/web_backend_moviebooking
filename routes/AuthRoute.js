const jwt= require("jsonwebtoken")
const SECRET_KEY="6801863cb1b653e57029ae63c6c2edf7c8b0d1848d20adb903d795e811d08f68";

function authenticateToken(req,res,next){
    const token=req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).send("Access denied: No token provided")
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY)
        req.user = verified;
        next()
    }catch (e) {
        res.status(400).send("Invalid token")
    }

}

function authorizeRole(role){
    return (req,res,next)=>{
        if(req.user.role!==role){
            return res.status(403).send("Access Denied:Insufficient Permissions")
        }

        next();
    }
}

module.exports={authenticateToken,authorizeRole}