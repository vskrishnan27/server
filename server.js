const express = require('express');
const ProductDataSchema = require("./models/ProductSchema")
const { default: mongoose } = require('mongoose');
const mangoUrl = 'mongodb+srv://stockmanager:GWc0t9Z2ePgkxzcW@cluster0.ulojg.mongodb.net/?retryWrites=true&w=majority'
const mango = require('mongoose');
const sales = require("./models/ProductSales");

mango.connect(mangoUrl,{
    useNewUrlParser: true,
  })
const connection = mongoose.connection;
connection.once("open",()=>{
    console.log("Connected!")
})
const data = express();

data.use(express.json())

const port = process.env.PORT || 5000

data.listen(port,()=>{
    console.log(`http:localhost:${port}`)
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

data.delete("/deleteProduct",async (req,res)=>{
    const pName=req.body.ProductName
    console.log(pName)
    await ProductDataSchema.deleteOne({"ProductName":pName});
    res.send(`${pName} : deleted sucessfully`)
    console.log("deleted")
})

data.patch('/update',async(req,res)=>{
    
    await ProductDataSchema.findOneAndUpdate({ProductId : req.body.ProductId},{$set :{ProductStock:req.body.newStock} })
    res.send("updated")

})

// ====> to update the billing array of stocks at one request <======
data.post('/updateStocks',async(req,res)=>{
    items = req.body.data
    console.log(items)
    items.map(async(data)=>{
        console.log(data.ProductId,data.ProductStock)
        await ProductDataSchema.findOneAndUpdate({ProductId : data.ProductId},{$set :{ProductStock:data.ProductStock} })
    }
    )
    console.log("bill of product updated")
    res.send("updated")

})

data.post('/sales', async(req,res)=>{
    try{
        sale = req.body.data
        console.log(sale)
        sale.map(async(data,ind)=>{

        const newsalesData = new sales({
            SalesId :data.SalesId,
            ProductId : data.ProductId,
            ProductName:data.ProductName,
            ProductPrice:data.ProductPrice,
            ProductQty : data.ProductQty,
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
    const d = await sales.find().sort({_id:-1});
    res.send(d)
})