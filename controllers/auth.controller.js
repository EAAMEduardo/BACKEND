const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const createToken = require("../libs/jwb")
const jwt = require("jsonwebtoken")
const TOKEN_KEY = require("../confi")


const register = async (req, res) => {

    try {

        const {username, email, password} = req.body

        const existed = await User.findOne({email})
        if(existed) return res.status(400).json(["email already registered"])

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            username, email, password: passwordHash
        })
         
 
        await newUser.save()

       const token =  await createToken({id: newUser._id})


       res.cookie("token", token)
        res.json({
            username: newUser.username,
            email: newUser.email,
            id: newUser._id,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            avatar: newUser.avatar,
            favorites: newUser.favorites,
            keyToken: token
        })


    } catch (error) {
        return res.status(500).json([error.message])
    }
}


const login = async (req, res) => {

    try {

        const { email, password} = req.body

        const userFound = await User.findOne({email})
        if(!userFound) return res.status(400).json(["user not found"])

        const isMatch = await bcrypt.compare(password, userFound.password)

         if(!isMatch) return res.status(400).json(["incorrect password"])

       const token =  await createToken({id: userFound._id})


       res.cookie("token", token)
        res.json({
            username: userFound.username,
            email: userFound.email,
            id: userFound._id,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            avatar: userFound.avatar,
            favorites: userFound.favorites,
            keyToken: token
        })


    } catch (error) {
        return res.status(500).json([error.message])
    }
}


const logout = (req, res) => {
   res.cookie("token", "", {
    expires: new Date(0)
   })

   return res.status(200).json(["logout succesfully"])
}



const profile = async (req, res) => {
  try {
    const {id} = req.user

    if(!id) return res.status(400).json(["Unauthorized"])

    const userProfile = await User.findById(id)

    if(!userProfile) return res.status(400).json(["User not found"])

    res.json({
        username: userProfile.username,
        email: userProfile.email,
        id: userProfile._id,
        createdAt: userProfile.createdAt,
        updatedAt: userProfile.updatedAt,
        favorites:userProfile.favorites
    })
  } catch (error) {
    console.log(error)
  }
}

const withGoogle = async (req, res) => {
  try {
    const {username, email, avatar} = req.body

    const user = await User.findOne({email})

    if(user) {
        const token = await createToken({id: user._id})
        res.cookie("token", token, {httpOnly: true})
        res.status(200)
        res.json({
            avatar: user.avatar,
            username: user.username,
            email: user.email,
            id: user._id,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt,
            favorites: user.favorites,
            keyToken: token
        })
    } else {
        const generatePass = Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(generatePass, 10)

        const newUser = new User({
            username, email, password: hashedPassword, avatar
        })

        await newUser.save()

        const token = await createToken({id: newUser._id})

        res.status(200)
        res.cookie("token", token, {httpOnly:true})
        res.json({
            avatar:newUser.avatar ,
            username: newUser.username,
            email: newUser.email,
            id: newUser._id,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            favorites: newUser.favorites,
            keyToken: token
        })
    }
    
  } catch (error) {
    console.log(error)
  }
}




const updateProfile = async (req, res) => {
   try {
    const{password, avatar, email, username, favorite} = req.body
    const {id} = req.params
 
    if(password) {
      const hashedPass = await bcrypt.hash(password, 10)
      const userUpdated = await User.findByIdAndUpdate(id,
         {username, email, password:hashedPass, avatar}, {new:true})

         if(!userUpdated) {
            res.status(400).json(["user not found"])
         }
 
         res.json({
            username: userUpdated.username,
            id: userUpdated._id,
            email: userUpdated.email,
            favorites: userUpdated.favorites,
            avatar: userUpdated.avatar
         })

    } else if (favorite) {
       
        const newFav = favorite
       const updateFav = await User.findOneAndUpdate(
        { _id: id},
        {
          $addToSet: {
            favorites: newFav
          }
        },{new: true})

        if(!updateFav) return res.status(400).json(["user dosnt found"])

        res.json({
            username: updateFav.username,
            avatar: updateFav.avatar,
            email: updateFav.email,
            favorites: updateFav.favorites,
            id: updateFav._id
            
        })
    } else {
       
        const updateUser = await User.findByIdAndUpdate(id, req.body, {new: true})

        if(!updateUser) {
            res.satatus(400).json(["user not found"])
        }

        res.json({
            username: updateUser.username,
            email: updateUser.email,
            id: updateUser._id,
            favorites: updateUser.favorites,
            avatar: updateUser.avatar
        })
    }
   } catch (error) {
    console.log(error)
    res.status(400).json(["user couldnt get updated"])
   }


}

const tokenVerify = async (req, res) => {
     try {
        const {token} = req.cookies
        if(!token) return res.status(401).json(["not token found"])

        jwt.verify(token, TOKEN_KEY, async (error, user) => {
            if(error) {
                res.status(400).json(["invalid token"])
            }
            console.log(user)

            const userFound = await User.findById(user.id)

            if(!userFound) return res.status(401)

            res.json({
                id: userFound._id,
                email: userFound.email,
                username: userFound.username,
                avatar: userFound.avatar,
                favorites: userFound.favorites
            })


        } )


     } catch (error) {
        res.status(401).json(["Invalid token"])
     }
}
 

const deleteProfile = async (req, res) => {

    const {id} = req.params

    if(!id) return res.status(401).json(["unauthorized, not token"])

    if(id !== req.user.id)
    return res.status(400).json(["you can only delete your own account"])

  

    try {
        const userDeleted = await User.findByIdAndDelete(id)

        if(!userDeleted) return res.status(404).json(["user not found"])

        res.status(200).json(["Account removed successfully"])
        
    } catch (error) {
        res.status(400).json(["account couldnt be revomed"])
    }

}

const getUser = async (req, res) => {
   try {
     const {id} = req.params
     
     if(!id) return res.status(400).json(["unauthorized, not token"])

     const listingUser = await User.findById(id)

     if(!listingUser) return res.status(400).json(["listing's owner not found"])

     res.status(200)
     res.json({
        username: listingUser.username,
        email: listingUser.email,
        id: listingUser._id,
        favorites: listingUser.favorites,
        avatar: listingUser.avatar
     })

   } catch (error) {
     res.status(400).json(["listing's user doesnt exist"])
   }
}


const deleteFav = async (req, res) => {
    try {
       
        const {id} = req.params
        const {noFav} = req.body
        const userUpdated = await User.findOneAndUpdate(
            { _id: id },
            {
                $pull: {
                    favorites: noFav
                }
            },
            {new: true}
        )

    

        if(!userUpdated) return res.status(400).json(["user wasnt found"])


        res.json({
            username: userUpdated.username,
            email: userUpdated.email,
            avatar: userUpdated.avatar,
            id: userUpdated._id,
            favorites: userUpdated.favorites
        })

    } catch (error) {
        res.status(400).json(["listing wasnt removed"])
    }
}





module.exports = {
    register,
     login,
     logout,
     profile,
     withGoogle,
     updateProfile,
     tokenVerify,
     deleteProfile,
     getUser,
     deleteFav
}