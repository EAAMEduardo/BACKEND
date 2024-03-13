const {Router} = require("express")
const authRequired = require("../middlewares/validateToken")
const {createListing, getListings, deleteListing, updateListing, getUniquedListing, getSearchListings} = require("../controllers/listing.controller")


const router = Router()


router.post("/api/listing/create", authRequired,  createListing)

router.get("/api/listings/:id", authRequired, getListings)

router.get("/api/listing/:id",  getUniquedListing)

router.delete("/api/delete/listing/:id", authRequired, deleteListing )

router.get("/api/get", getSearchListings)

router.put("/api/update/listing/:id", authRequired, updateListing)




module.exports = router