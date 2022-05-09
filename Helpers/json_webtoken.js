require('dotenv').config()

const jwt = require("jsonwebtoken");


module.exports = (req,res,next)=>{

    let authHeader = req.headers.authorization
    

    if(authHeader==undefined){

        res.status(401).send({error:"NO TOKEN PROVIDED"})

    }

    let token = authHeader.split(" ")[1]
    jwt.verify(token,process.env.JWT_TOKEN,(err,decoded)=>{

        if(err){
            res.status(500).send({error:"authentication failed",err:err})
        } else {
            // res.status(500).send(decoded)
            next();

        }
    })


}