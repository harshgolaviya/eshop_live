const express=require('express');
const Category = require('../Models/category');
const Products = require("../Models/products");
products=express.Router()
products.use(express.json())
products.use(express.urlencoded())


products.get('/',(req,res)=>{
    Products.find({},(err,result)=>{
        if(err) throw err
        else{
            res.send(result)
        }
    })
})

products.post('/',async(req,res)=>{
    const category=await Category.findById(req.body.category);
    if(!category) return res.status(400).send("Invalid Category")

    let product=new Products({
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:"image",
        images:"images",
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countinStock:req.body.countinStock,
        rating:req.body.rating,
        isFeatured:req.body.isFeatured,
        dateCreted:req.body.dateCreted,
    })
    product=await product.save()
    if(!product) return res.status(500).send("The product cannot be created")
    res.send(product)    
})
    // Products.create(product,(err,result)=>{
    //     if(err) throw err
    //     else{
    //     console.log(result);
    //     }
    // })


    // const result=Products.insertMany(req.body,(err,resul)=>{
    //     if(err) throw err
    //     else{
    //         res.json({msg:"Insert data successfull"})
    //         console.log(resul);
    //     }
    // })

//     product.put('/',(req,res)=>{
//       Products.updateOne(
//         {name:req.body.name},{$set:{price:req.body.price}},
//         (err,result)=>{
//             if(err) throw err
//             else{
//                 res.send(result)
//                 console.log(result);
//             }
//         })
// })


products.put('/:id',async(req,res)=>{
        const productid=await Products.findByIdAndUpdate(
            req.params.id,
            {
                price:req.body.price
            }
        )
        if(!productid) return res.status(500).send("Id not founded...")
        res.send(productid)
    })


module.exports=products