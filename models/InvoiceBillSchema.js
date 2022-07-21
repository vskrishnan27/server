const mongoose = require('mongoose')

const InvoiceBillSchema = new mongoose.Schema ({    
        invoiceNum :{
            type:Number,
            required:true,
            unique:true
        },
        shopName :{
            type:String,
        },
        shopAddress : {
            type:String
        },
        product :{
            type : Array,
            required:true
        },
        totalCost : {
            type : Number,
            required : true
        },
           
} , {timestamps: true} )

module.exports = mongoose.model("InvoiceBillSchema",InvoiceBillSchema)
