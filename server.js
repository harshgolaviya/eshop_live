const express=require('express')
const  mongoose  = require('mongoose')
const morgan = require('morgan')
const cors=require('cors')
require('dotenv/config')

const app=express()


app.use(express.json())
app.use(express.urlencoded())


app.use(cors())
app.options("*",cors())
app.use(morgan("tiny"))


mongoose.pluralize(null);
mongoose.set('strictQuery',false)



mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true})
.then(()=>{console.log('Connect')})
.catch((err)=>{console.log(err)})




const category=require('./Router/category')
app.use('/category',category)

const products=require('./Router/products')
app.use('/products',products)

const orders=require('./Router/order')
app.use('/orders',orders)

const orderitems=require('./Router/orderitems')
app.use('/orderitems',orderitems)

const users=require('./Router/users')
app.use('/users',users)


const PORT=process.env.PORT||3300
app.listen(PORT,()=>{
    console.log('Server listening...');
})
