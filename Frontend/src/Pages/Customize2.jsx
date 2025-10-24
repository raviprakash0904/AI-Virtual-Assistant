import React, { useContext, useState } from 'react'
import { userDataContext } from '../Context/UserContext'
import axios from 'axios'
import { IoArrowBackOutline } from "react-icons/io5";
import {useNavigate} from 'react-router-dom';

function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData } = useContext(userDataContext)
    const [assistantName,setAssistantName]=useState(userData?.assistantName || "") 
    const [loading,setloading]=useState(false)
    const navigate=useNavigate()
    
    const handleUpdateAssistant=async ()=>{
      setloading(true)
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);

            // Agar user ne local file upload ki hai
            if (backendImage) {
                formData.append("assistantImage", backendImage);
                }
            else {
                formData.append("imageUrl", selectedImage);
            }

            const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true,
              headers: { "Content-Type": "multipart/form-data" }
            })

            setloading(false)
            console.log(result.data)
            setUserData(result.data )
            navigate("/")
        } catch (error) {
          setloading(false)
            console.log(error)
        }
    }
    
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#010158] flex justify-center items-center flex-col p-[20px] relative'>
      <IoArrowBackOutline className='absolute top-[30px] left-[30px] cursor-pointer text-white w-[25px] h-[25px]' onClick={()=>navigate("/customize")}/>
      <h1 className='text-white text-[30px] mb-[40px] text-center'>Enter Your <span className='text-blue-200'>Assistant Name </span></h1>
      <input type="text" placeholder='eg. Shifra' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] mb-5' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/> 
      {assistantName && <button className='min-w-[300px] h-[60px] bg-white rounded-full text-black font-semibold mt-10 text-[19px] cursor-pointer' disabled={loading} onClick={()=>{
        handleUpdateAssistant()
        }}>{!loading?"Finally Create Your Assistant":"Loading..."}</button>}
      
    </div>
  ) 
}

export default Customize2
