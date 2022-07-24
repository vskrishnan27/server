

const express = require('express')
const router = express.Router()
var ProductSales = require('../models/ProductSales.js')



router.get('/findGstBill', async (req, res) => {
    const { num } = req.query;
    try {
        const GstBillDetails = await ProductSales.find({ salesid: { $gte: num } })
        res.send(GstBillDetails)
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