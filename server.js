require("dotenv").config({path:"./.env"})
const express = require('express');

const ProductDataSchema = require("./models/ProductSchema")
const { default: mongoose } = require('mongoose');

const mangoUrl = process.env.MANGOURL;
const mango = require('mongoose');
const sales = require("./models/ProductSales");
var cors = require('cors');


mango.connect(mangoUrl,{
    useNewUrlParser: true,
  })
const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("Connected!")
})
const data = express();

data.use(express.json())
data.use(cors())
const port = process.env.PORT || 5000

data.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})


data.get("/list/",  (req, res) => {
    ProductDataSchema.find({}, (err, result) => {
      res.send(result);
    });
  });

data.post('/productList', async(req,res)=>{
    try{
        console.log("res.body : ",req.body);

        const newProductData = new ProductDataSchema({
            ProductId :req.body.ProductId,
            ProductName : req.body.ProductName,
            ProductActualPrice:req.body.ProductActualPrice,
            ProductRetailPrice:req.body.ProductRetailPrice,
            ProductStock : req.body.ProductStock
        }) 

        await ProductDataSchema.create(newProductData)
        res.send("Product Added Successfully")

    }catch(err){
        console.log(`Crashed post ${err}`)
        res.status(500).send("Server error");
    } 
})


// ===============================>||   DELETE  || <================================================

data.post("/deleteProduct",async (req,res)=>{
    const pName=req.body.ProductName
    console.log(pName)
    
    await ProductDataSchema.deleteOne({"ProductName":pName});
    res.send(`${pName} : deleted sucessfully`)
    console.log("deleted")
})

data.patch('/update',async(req,res)=>{
   

    const newVal = {ProductStock:req.body.modalData.stock,ProductActualPrice:req.body.modalData.actual,ProductRetailPrice:req.body.modalData.retail}
    await ProductDataSchema.findOneAndUpdate(
        {ProductId : req.body.modalData.id},
        {$set : newVal}
        )
    res.send("updated")

})

// ====> to update the billing array of stocks at one request <======
data.post('/updateStocks',async(req,res)=>{
    items = req.body.bill

    items.map(async(data)=>{
      
        await ProductDataSchema.findOneAndUpdate({ProductId : data.Id},{$set :{ProductStock:data.BalanceStock} })
    }
    )
   
    res.send("updated")

})

data.post('/sales', async(req,res)=>{
    try{
        sale = req.body.bill
       
        sale.map(async(data,ind)=>{

        const newsalesData = new sales({
            SalesId :data.SalesId,
            ProductId : data.Id,
            ProductName:data.Name,
            ProductPrice:data.Rate,
            ProductQty : data.Quantity,
        }) 

        await sales.create(newsalesData)
    })
        
        res.send("sales Added Successfully")

    }catch(err){
        console.log(`Crashed post ${err}`)
        res.status(500).send("Server error");
    } 
})


data.get('/lastsale',async(req,res)=>{ 
    const d = await sales.find().sort({_id:-1}).limit(100);
    res.send(d)
})

data.get('/findbill',async(req,res)=>{ 
    let {billno} = req.query
    let salesList= await sales.find({SalesId:billno});
    
    
    res.send(salesList)
})