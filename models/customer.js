const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
         min: 0,
         max: 130
    }
});

// model 
const Customer = mongoose.model( 'Customer', customerSchema);

module.exports = Customer;