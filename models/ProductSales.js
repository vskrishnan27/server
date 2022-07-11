
const mongoose = require("mongoose")

const SalesSchema = mongoose.Schema;

const newSales = new SalesSchema({
    SalesId: {
        type:Number,
        required:true
    },
    ProductId:{
        type:String,
        required:true,
        
    },
    ProductName : {
        type :String,
        required:true
    },
    ProductPrice: {
        type:Number
    },
    ProductQty : {
        type:Number
    },
    Profit:{
        type:Number
    },
    SalesDate : {
        time : { type : Date, default: Date.now }
    }
})

const SalesData = mongoose.model("SalesData",newSales);

module.exports = SalesData;