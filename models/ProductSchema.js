
const mongoose = require("mongoose")

const prdctSchema = mongoose.Schema;

const newProduct = new prdctSchema({
    ProductId: {
        type: String,
        required: true,
        unique: true
    },
    ProductName: {
        type: String,
        required: true
    },
    ProductActualPrice: {
        type: Number
    },
    ProductRetailPrice: {
        type: Number
    },
    ProductStock: {
        type: Number
    },
    GSTPercentage: {
        type: Number
    },
    GSTPrice: {
        type: Number
    },
    DataLogs: {
        type: Array
    }
}, { timestamps: true })

const ProductData = mongoose.model("ProductData", newProduct);

module.exports = ProductData;