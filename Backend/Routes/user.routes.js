import express from "express"
import { askToAssistant, getCurrentUser, updateAssistant } from "../Controllers/user.controllers.js"
import isAuth from  "../Middlewares/isAuth.js"
import upload from "../Middlewares/multer.js"

const userRouter = express.Router()


userRouter.get("/current",isAuth,getCurrentUser )
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
userRouter.post("/asktoassistant",isAuth,askToAssistant)

export default userRouter 