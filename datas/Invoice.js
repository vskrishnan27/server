const express = require('express')
const router = express.Router();
const InvoiceBillSchema = require('../models/InvoiceBillSchema')
const product = require('../models/ProductSchema')

router.post('/createinvoicebill', async (req, res) => {
    const { invoiceNum, shopName, shopAddress, product, totalCost } = req.body
    try {
        let newBill = new InvoiceBillSchema({
            invoiceNum, shopName, shopAddress, product, totalCost
        })
        await InvoiceBillSchema.create(newBill)
        res.send(newBill)
    } catch (err) {
        res.sendStatus(500)
    }
})

router.post('/updateProduct', async (req, res) => {
    const newVal = { ProductStock: req.body.modalData.stock, ProductActualPrice: req.body.modalData.actual, ProductRetailPrice: req.body.modalData.retail }
    await ProductDataSchema.findOneAndUpdate(
        { ProductId: req.body.modalData.id },
        { $set: newVal }
    )
    res.send("updated")
})

/*
router.get('/viewInvoice', async (req, res) => {
    const { invoiceNum } = req.query;
    try {
        const invoiceDetails = await InvoiceBillSchema.find({product : {$elemMatch : {name : invoiceNum }}});
        res.send(invoiceDetails)
    } catch (err) {
        res.send(JSON.stringify({
            status: "failed",
            error: err,
            invoiceNum
        })
        )
    }
}
)
// Find array of objectt in mangodb
*/
router.get('/viewInvoice', async (req, res) => {
    const { invoiceNum } = req.query;
    try {
        const invoiceDetails = await InvoiceBillSchema.find({ invoiceNum });
        res.send(invoiceDetails)
    } catch (err) {
        res.send(JSON.stringify({
            status: "failed",
            error: err,
            invoiceNum
        })
        )
    }
}
)

module.exports = router