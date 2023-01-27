const express = require('express')
const { connection } = require('mongoose')
const OrderItems = require('../Models/orderitems')
const Orders = require("../Models/orders")

orders = express.Router()



// orders.get('/', (req, res) => {
//     Orders.find({}, (err, result) => {
//         if (err) throw err
//         else {
//             res.send(result)
//         }
//     })
// })

orders.get('/',async(req,res)=>{
    const orderlist=await Orders.find()
    .populate("user","name")
    .sort({dateOrdered:-1})
    if(!orderlist){
        res.status(500).json({Success:false})
    }
    res.send(orderlist)
})


orders.get('/:id',async(req,res)=>{
    const orderlist=await Orders.findById(req.params.id)
    .populate("user","name")
    .populate({
        path:"orderitems",
        populate:{
            path:"product",
            populate:"category"
        },
    })
    if(!orderlist){
        res.status(500).json({Success:false})
    }
    res.send(orderlist)
})

// orders.post('/',(req,res)=>{
//     const result=Orders.insertMany(req.body,(err,resul)=>{
//         if(err) throw err
//         else{
//             res.json({msg:"Insert data successfull"})
//             console.log(resul);
//         }
//     })
// })

orders.post('/', async (req, res) => {
    const orderItemIds = Promise.all(
        req.body.orderitems.map(async (x) => {
            let newOrderItem = new OrderItems({
                quantity: x.quantity,
                product: x.product,
            })
            newOrderItem1 = await newOrderItem.save()
            return newOrderItem._id
        })
    )

    const orderItemsIdsResolved = await orderItemIds;
    const totalPrices = await Promise.all(
        orderItemsIdsResolved.map(async (x) => {
            const orderItem = await OrderItems.findById(x).populate(
                "product",
                "price",
            )
            const totalPrice = orderItem.product.price * orderItem.quantity
            return totalPrice
        })
    )

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

        const order = new Orders({
            orderitems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            totalPrice: totalPrice,
            user: req.body.user,
        })
        const order_in = await order.save()
        if (!order_in) return res.status(500).send('Invalid information')
        res.send(order)
})


orders.delete('/:id',async(req,res)=>{
    const id=await Orders.findByIdAndRemove(req.params.id)
    if(!id) return res.status(500).send("Id not founded...")
    res.send(id)
})
module.exports = orders
