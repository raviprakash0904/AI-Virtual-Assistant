import express from "express"
import { Login, logOut, signUp ,deleteUser} from "../Controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",Login)
authRouter.get("/logout",logOut)
authRouter.delete("/delete/:id", deleteUser);

export default authRouter 