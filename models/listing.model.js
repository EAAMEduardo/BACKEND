const mongoose = require("mongoose")


const listingModel = new mongoose.Schema({

    name: {
        type:String,
        required: true,
        trim: true
    },

    description : {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    regularPrice: {
        type: Number,
        required: true
    },

    salePrice : {
        type: Number,
        required: true
    },

    bathrooms : {
        type: Number,
        required: true
    },

    bedrooms: {
        type: Number,
        required: true
    },

    furnished: {
        type: Boolean,
        required: true
    },

    parking: {
        type: Boolean,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    offer: {
        type: Boolean,
        required: true
    },

    imageUrls: {
        type: Array,
        required: true
    },

    userRef: {
        type: String,
        required: true,
      },
 
},

{timestamps: true})




module.exports = mongoose.model("Listing", listingModel)