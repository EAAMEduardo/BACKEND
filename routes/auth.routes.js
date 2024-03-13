const {Router} = require("express")
const {register, login, logout, profile, withGoogle, updateProfile, tokenVerify, deleteProfile, getUser, deleteFav} = require("../controllers/auth.controller")
const authRequired = require("../middlewares/validateToken")
const validateSchema = require("../middlewares/validateSchema")
const {loginSchema, registerSchema} = require("../schemas/auth.schema")

const router = Router()

router.post("/api/register", validateSchema(registerSchema),  register )
router.post("/api/login", validateSchema(loginSchema),  login)
router.post("/api/google", withGoogle)
router.post("/api/logout", authRequired,  logout )
router.get("/api/profile", authRequired,  profile)
router.put("/api/update/:id", authRequired, updateProfile)
router.get("/api/verify-token", tokenVerify  )
router.post("/api/delete/:id", authRequired, deleteProfile)
router.get("/api/getUser/:id", authRequired, getUser)
router.post("/api/delete-fav/:id", authRequired, deleteFav)





 
module.exports = router 