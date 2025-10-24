import genToken from "../Config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async(req,res) => {
    try{
        const {name,email,password} = req.body

        const existEmail = await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message:"email already exist!"})
        }

        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 characters !"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            name,password:hashedPassword,email 
        })
        
        const token = await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure:false,
            path: "/"
        });

        return res.status(201).json(user)
    }
    catch(error){
        return res.status(500).json({message: `sign up error ${error}`})
    }
}

export const Login = async(req,res) => {
    try{
        const {email,password} = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"email does not exists !"})
        }

        if(password.length<6){
            return res.status(400).json({message:"password must be atleast 6 characters !"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({message:"incorrect password"})
        }
        
        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",  // required for cross-site cookies
            secure: true       // must be true with https
          });
          
          

        return res.status(200).json(user)
    }
    catch(error){
        return res.status(500).json({ message: `login error ${error}` })
    }
}

export const logOut = async(req,res) => {
    try{
        res.clearCookie("token")
        return res.status(200).json({message:"log out successfully"})
    }
    catch(error) {
        return res.status(500).json({message: `logout error ${error}`})

    }
}


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);

    // Clear the auth token cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true   // use true in production with HTTPS
    });

    res.status(200).json({ message: "User deleted successfully and cookie cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};




