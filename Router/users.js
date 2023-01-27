const express=require('express')
const Users = require('../Models/users')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
users=express.Router()
require('dotenv/config')

users.get('/',(req,res)=>{
    Users.find({},(err,result)=>{
        if(err) throw err
        else{
            res.send(result)
        }
    })
})

// users.post('/',(req,res)=>{
//     const result=Users.insertMany(req.body,(err,resul)=>{
//         if(err) throw err
//         else{
//             res.json({msg:"Insert data successfull"})
//             console.log(resul);
//         }
//     })
// })

users.post('/',async(req,res)=>{
    const user=new Users({
         name:req.body.name,
         email:req.body.email,
         passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
         street:req.body.street,
         apartment:req.body.apartment,
         city:req.body.city,
         zip:req.body.zip,
         country:req.body.country,
         phone:req.body.phone,
         isAdmin:req.body.isAdmin
    }) 
    const user_in=await user.save()
    if(!user_in) return res.status(500).send("Data not founded...")
    res.send(user_in)
})

users.post('/login',async(req,res)=>{
    const user=await Users.findOne({email:req.body.email})
    const secret=process.env.secret;
    if(!user){
        return res.status(400).send("The user not founded")
    }
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash))
    {
        const token=jwt.sign(
            {
                username:user.name,
                isAdmin:user.isAdmin,
            },
            secret,
            {expiresIn:"1d"}
        )
        res.status(200).send({user:user.email,token:token})
    }else{
        res.status(400).send("Password is wrong!")
    }
})


users.put('/:id',async(req,res)=>{
    const user=await Users.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            email:req.body.email,
        })
        if(!user) return res.status(500).send("User not Founded")
        res.send(user)
})

users.delete('/:id',async(req,res)=>{
     const user=await Users.findByIdAndRemove(req.params.id)
     if(!user){
         res.status(500).send("Not founded...")
     }else{
        res.status(200).send("Successfull")
     }
})


module.exports=users