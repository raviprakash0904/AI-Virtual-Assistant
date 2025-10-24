import React , { createContext, useEffect, useState } from 'react'
import axios from "axios";


export const userDataContext= createContext()
function UserContext({children}) {
  const serverUrl = "http://localhost:8000"
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const[frontendImage,setFrontendImage]=useState(null)
  const[backendImage,setBackendImage]=useState(null)
  const[selectedImage,setSelectedImage]=useState(null)

  const handleCurrentUser = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
      setUserData(result.data)
      console.log("Current User =>", result.data)
    } catch (error) {
      console.log("Current user error:", error.response?.data || error.message)
      setUserData(null)
    } finally {
      setLoading(false)   // ✅ ye add karna zaruri hai
    }
  }

  const getGeminiResponse=async (command)=>{
    try {
      const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
      return result.data
    } catch (error) {
      console.log(error)
    }
  }




  useEffect(()=>{
handleCurrentUser() 
  },[])
  const value={
    serverUrl,userData,setUserData,loading,frontendImage,setFrontendImage,
    backendImage,setBackendImage,selectedImage,setSelectedImage,getGeminiResponse
  }
  return (
    <div>
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
    </div>
  ) 
}

export default UserContext
