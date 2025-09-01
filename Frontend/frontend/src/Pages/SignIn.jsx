import React , {useContext, useState} from 'react'
import bg from "../assets/authBg.png"
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../Context/UserContext';
import axios from 'axios'
 
function SignIn() {
    const[showPassword,setShowPassword] = useState(false)
    const {serverUrl,userData,setUserData} = useContext(userDataContext)
    const navigate = useNavigate()
  
    const [email,setEmail] = useState("")
    const[loading,setLoading] = useState(false)
    const [password,setPassword] = useState("")
    const[err,setErr] = useState("")

    const handleSignIn = async(e) => {
        e.preventDefault()
        setErr("")
        setLoading(true)
        try{
            let result = await axios.post (`${serverUrl}/api/auth/signin`,{email,password},{withCredentials:true})
            setUserData(result.data)
            setLoading(false)
            navigate("/")
    } catch (error) {
      console.log(error)
      setUserData(null)
      setLoading(false)
      setErr(error.response.data.message)
    }
}
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center flex-col space-between' style={{backgroundImage:`url(${bg})`}}>
      <form className='w-[90%] h-[600px] mb-10 max-w-[500px] bg-[#00000081] backdrop-blur shadow-black flex flex-col justify-center items-center gap-20px px-[20px]' onSubmit={handleSignIn}>
      <h1 className='text-white text-2xl mb-[60px] font-semibold'>Sign In to <span className='text-blue-400 text-2xl'>Virtual Assistant</span></h1> 
      
        
      <input type="email" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] mb-5' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
        <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
        <input type={showPassword?"text":"Password"} placeholder='Password' className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px] mb-5' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
        {!showPassword && <IoMdEye className='absolute top-[14px] right-[20px] w-[25px] text-[white] size-8 cursor-pointer' onClick={() => setShowPassword(true)}/>}

        {showPassword && <IoMdEyeOff  className='absolute top-[14px] right-[20px] w-[25px] text-[white] size-8 cursor-pointer' onClick={() => setShowPassword(false)}/>}
        </div>
        {err.length>0 && <p className='text-red-500 text-[17px] mt-2'>
          *{err}
        </p>}

        <button className='min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold mt-10 text-[19px]' disabled={loading}> {loading?"Loading...":"Sign In"}</button>
        <p className='text-white text-[18px] cursor-pointer mt-4' onClick={() => navigate("/signup")}>Want to create a new account ? <span className='text-blue-400'>Sign Up </span></p>
      </form>
    </div>
  )
}

export default SignIn
