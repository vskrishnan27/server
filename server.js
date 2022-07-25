require("dotenv").config({ path: "./.env" })
const express = require('express');

const ProductDataSchema = require("./models/ProductSchema.js")
const InvoiceBillSchema = require("./models/InvoiceBillSchema.js")
const { default: mongoose } = require('mongoose');

const mangoUrl = process.env.MANGOURL;
const mango = require('mongoose');
const sales = require("./models/ProductSales.js");
var cors = require('cors');
const { CommandFailedEvent } = require("mongodb");
// 


mango.connect(mangoUrl, {
    useNewUrlParser: true,
})
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("DB Connected!")
})
const data = express();

data.use(express.json())
data.use(cors())
const port = process.env.PORT || 4000

data.listen(port, () => {
    console.log(`http://localhost:${port}`)
})


data.get("/list", (req, res) => {
    ProductDataSchema.find({}, (err, result) => {
        res.send(result);
    });
});

data.post('/productList', async (req, res) => {
    try {
        console.log("res.body : ", req.body);

        const newProductData = new ProductDataSchema({
            ProductId: req.body.ProductId,
            ProductName: req.body.ProductName,
            ProductActualPrice: req.body.ProductActualPrice,
            ProductRetailPrice: req.body.ProductRetailPrice,
            ProductStock: req.body.ProductStock,
            GSTPercentage: req.body.GSTPercentage,
            GSTPrice: req.body.GSTPrice
        })

        await ProductDataSchema.create(newProductData)
        res.send("Product Added Successfully")

    } catch (err) {
        console.log(`Crashed post ${err}`)
        res.status(500).send("Server error");
    }
})


// ===============================>||   DELETE  || <================================================

data.post("/deleteProduct", async (req, res) => {
    const pName = req.body.ProductName
    await ProductDataSchema.deleteOne({ "ProductName": pName });
    res.send(`${pName} : deleted sucessfully`)
    console.log("deleted")
})

data.patch('/update', async (req, res) => {
    const newVal = { ProductStock: req.body.modalData.stock, ProductActualPrice: req.body.modalData.actual, ProductRetailPrice: req.body.modalData.retail }
    await ProductDataSchema.findOneAndUpdate(
        { ProductId: req.body.modalData.id },
        { $set: newVal }
    )
    res.send("updated")

})

// ====> to update the billing array of stocks at one request <======
data.post('/updateStocks', async (req, res) => {
    items = req.body.bill

    items.map(async (data) => {

        await ProductDataSchema.findOneAndUpdate({ ProductId: data.Id }, { $set: { ProductStock: data.BalanceStock } })
    }
    )

    res.send("updated")

})

data.post('/sales', async (req, res) => {
    try {
        sale = req.body.schemaBill
        await sales.create(sale)
        res.send("sales Added Successfully")
    } catch (err) {
        console.log(`Crashed post ${err}`)
        res.status(500).send("Server error");
    }
})


data.get('/lastsale', async (req, res) => {
    const d = await sales.find().sort({ _id: -1 }).limit(100);
    res.send(d)
})

data.get('/findbill', async (req, res) => {
    let { billno } = req.query
    let salesList = await sales.findOne({ salesid: billno });
    console.log(salesList)
    res.send(salesList)
})

data.get('/findProductDetail', async (req, res) => {
    let { billno } = req.query
    let ProductDetails = await ProductDataSchema.findOne({ ProductId: billno });
    console.log(ProductDetails)
    res.send(ProductDetails)
})

data.get('/borrow', async (req, res) => {
    let { phone } = req.query
    console.log(phone)
    let salesData = await sales.find({ "userDetail.phone": { $eq: phone } }).sort({ createdAt: -1 });
    console.log("hi", salesData)
    res.send(salesData)
})


invoice = require("./datas/invoice.js");


data.use('/invoice', invoice)

var GstBill = require("./datas/GstBill.js")

data.use('/gstbill', GstBill)



// => direct fetching the data from db using regex

data.get("/fetch", async (req, res) => {
    // {'name': {'$regex': 'sometext'}}
    const { val } = req.query
    if (!val) return res.send([])
    const data = await ProductDataSchema.find({ ProductName: { '$regex': val, '$options': 'i' } });

    res.send(data)
});




