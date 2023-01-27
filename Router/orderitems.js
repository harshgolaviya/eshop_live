const express=require('express')
const OrderItems = require("../Models/orderitems");
orderitems=express.Router()


orderitems.get('/',(req,res)=>{
    OrderItems.find({},(err,result)=>{
        if(err) throw err
        else{
            res.send(result)
        }
    })
})


orderitems.post('/',(req,res)=>{
    const result=OrderItems.insertMany(req.body,(err,resul)=>{
        if(err) throw err
        else{
            res.json({msg:"Insert data successfull"})
            console.log(resul);
        }
    })
})

orderitems.delete('/:id',async(req,res)=>{
    const orderItemid=await OrderItems.findByIdAndDelete(req.params.id)
    if(!orderItemid) return res.status(500).send("Id not founded..")
    res.send(orderItemid)
})

module.exports=orderitems