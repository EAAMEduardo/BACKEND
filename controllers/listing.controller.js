const Listing = require("../models/listing.model")


const createListing = async (req, res) => {
   try {

    const newListing = await Listing.create(req.body)
    return res.status(200).json(newListing)
    

   } catch (error) {
    res.status(400).json(["listing wasnt created"])
   }
   
}


const getListings =  async (req, res) => {
    try {
        const {id} = req.params

        if(req.user.id !== id) return res.status(401).json(["you can only get your own listings"])

        const listings = await Listing.find({userRef: id})

        if(!listings) return res.status(400).json(["thres not listings"])

         res.status(200).json(listings)
        
    } catch (error) {
        res.status(400).json(["no listings found"])
    }
}

const getUniquedListing = async (req, res) => {
    try {
        const {id} = req.params 

        const listing = await Listing.findById(id)

        if(!listing) return res.status(400).json(["listing wasnt found"])

        res.status(200).json(listing)
    } catch (error) {
        res.status(400).json(["we couldnt get the listing"])
    }
}


const deleteListing = async (req, res) => {
    try {
        const {id} = req.params

        const listing = await Listing.findById(id)

        if(!listing) return res.status(400).json(["the listing you are trying to delete donst exist"])

        if(req.user.id !== listing.userRef) return res.status(400).json(["you can only delete your own listings"])

         await Listing.findByIdAndDelete(id)

        res.status(200).json(["listing deleted successfully"])
    } catch (error) {
        res.status(400).json(["something happened,  the listing wasnt deleted"])
    }
}

const updateListing = async (req, res) => {
   try {
     const {id} = req.params

     const listingUpdated = await Listing.findByIdAndUpdate(id, req.body,{new: true})

     if(!listingUpdated) return res.status(400).json(["listing wast found"])
     
     res.status(200).json(listingUpdated)
   } catch (error) {
    
   }
}


const getSearchListings = async (req, res) => {
    try {

        let offer = req.query.offer
        
        if(offer === undefined || offer === "false") {
            offer = { $in: [false, true]}
        }

        let furnished =  req.query.furnished

        if(furnished === undefined) {
            furnished = {$in : [true, false]}
        } else if(furnished === "false") {
            furnished = false
        } else {
            furnished = true
        }

        let parking = req.query.parking

        if(parking === undefined) {
            parking = {$in : [true, false]}
        } else if(parking === "false") {
            parking = false
        } else {
            parking = true
        }

        let price = req.query.price

        if(price === undefined) {
            price = 0
        } 


        let type = req.query.type

        if(type === undefined || type === "all") {
            type = {$in : ["rent", "sell"]}
        }

        const searchTerm = req.query.searchTerm || ""

        const  sort = req.query.sort || "createdAt"

        const order = req.query.order || "desc"


        const foundListings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            regularPrice: {$gt: price},
            type,
        }).sort(
            {[sort] : order}
        )

         res.status(200).json(foundListings)
    

    } catch (error) {
        res.status(400).json(["Searched listings not found"])
    }
}
 


module.exports = {
    createListing,
    getListings,
    deleteListing,
    updateListing,
    getUniquedListing,
    getSearchListings
}