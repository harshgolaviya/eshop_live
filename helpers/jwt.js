const {expressJwt:jwt}=require('express-jwt')

const authJwt=()=>{
    const secret=process.env.secret
    // const api=process.env.API_URL
    return jwt({
        secret:"harsh",
        algorithms:["HS256"],
        // isRevoked:isRevoked,
    }).unless({path:["/users/login"]})
}

module.exports=authJwt()