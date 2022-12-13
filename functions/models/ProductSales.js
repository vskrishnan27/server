
const mongoose = require("mongoose")

// const SalesSchema = mongoose.Schema;

// const newSales = new SalesSchema({


//     SalesId: {
//         type:Number,
//         required:true
//     },
//     ProductId:{
//         type:String,
//         required:true,

//     },
//     ProductName : {
//         type :String,
//         required:true
//     },
//     ProductPrice: {
//         type:Number
//     },
//     ProductQty : {
//         type:Number
//     },
//     Profit:{
//         type:Number
//     },
//     SalesDate : {
//         time : { type : Date, default: Date.now }
//     }
// })

const newSales = new mongoose.Schema({
    salesid: {
        type: Number
    },
    userDetail: {
        type: Object
    },
    products: {
        type: Array
    }
}, { timestamps: true })

const SalesData = mongoose.model("SalesData", newSales);

module.exports = SalesData;