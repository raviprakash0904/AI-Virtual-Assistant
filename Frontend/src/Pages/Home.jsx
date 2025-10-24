  import React, { useContext, useRef, useEffect, useState } from 'react'
  import { userDataContext } from '../Context/UserContext'
  import { useNavigate } from 'react-router-dom'
  import axios from "axios";
  import aiImg from "../assets/ai.gif"
  import userImg from "../assets/user.gif"
  import { TbMenuDeep } from "react-icons/tb";
  import { RxCross2 } from "react-icons/rx";
  import FancyButton from '../components/FancyButton';

  function Home() {
    const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
    const navigate=useNavigate()
    const[listening,setListening]=useState(false)
    const[userText,setUserText]=useState("")
    const[aiText,setAiText]=useState("")
    const isSpeakingRef=useRef(false)
    const[ham,setHam]=useState(false)
    const recognitionRef=useRef(null)
    const isRecognizingRef=useRef(false)
    const synth=window.speechSynthesis
    const [showPrompt, setShowPrompt] = useState(true);


    const handleLogOut=async ()=>{
      try {
        const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
        setUserData(null)
        navigate("/signin")
      } catch (error) {
        setUserData(null)
        console.log(error)
      } 
    }


    const startRecognition = () => {
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        try{
          recognitionRef.current?.start();
          console.log("Recognition requested to start")
        } catch(error){
          if(error.name !== "InvalidStateError"){
            console.log("Start error:", error);
          }
        }
      }
    };

    const speak=(text)=>{
      const utterance=new SpeechSynthesisUtterance(text)
      utterance.lang = 'hi-IN';
      const voices =window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang === 'hi-IN');
      if(hindiVoice) {
        utterance.voice = hindiVoice;
      }

      isSpeakingRef.current=true
      utterance.onend = () => {
        setAiText("");
        isSpeakingRef.current = false;
        setTimeout(() => {
          startRecognition(); // give time for voice output to finish fully
        }, 2000);
      };
      
      synth.cancel();       // pehle se koi speech ho to ussey hata dega
      synth.speak(utterance);
    }

    const handleCommand=(data)=>{
      const{type,userInput,response}=data
        speak(response);

        if(type === 'google-search'){
          const query = encodeURIComponent(userInput);
          window.open(`https://www.google.com/search?q=${query}`,
            '_blank');
        }
        if(type === 'calculator-open'){
  
          window.open(`https://www.google.com/search?q=calculator`,
            '_blank');
        }
        if(type === 'instagram-open'){
          
          window.open(`https://www.instagram.com/`, '_blank');
        }
        if(type === 'facebook-open'){
          
          window.open(`https://www.facebook.com/`, '_blank');
        }
        if(type === 'weather-show'){
  
          window.open(`https://www.google.com/search?q=weather`, '_blank');
        }
        if(type === 'youtube-search' || type === 'youtube-play'){
          const query = encodeURIComponent(userInput);
          window.open(`https://www.youtube.com/results?search_query=${query}`,
            '_blank');
        }
       
    }




    const speakGreeting = (name) => {
      const synth = window.speechSynthesis;
      synth.cancel();
    
      const sayIt = () => {
        let voices = synth.getVoices();
        if (!voices.length) {
          setTimeout(sayIt, 300);
          return;
        }
        let voice =
          voices.find(v => v.lang.toLowerCase().includes('hi')) ||
          voices.find(v => v.lang.toLowerCase().includes('en-in')) ||
          voices.find(v => v.lang.toLowerCase().includes('en')) ||
          voices[0];
        const utterance = new SpeechSynthesisUtterance(
          `Hello ${name}, what can I help you with?`
        );
        utterance.voice = voice;
        utterance.lang = voice.lang;
        utterance.pitch = 1.1;
        utterance.rate = 0.95;
        synth.speak(utterance);
      };
    
      if (synth.getVoices().length === 0) {
        synth.onvoiceschanged = sayIt;
      } else {
        sayIt();
      }
    };


    const handleStartAssistant = () => {
      speakGreeting(userData?.name || "User");
      setShowPrompt(false);
    };

    
    useEffect(() => {
      if (showPrompt) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "auto";
    }, [showPrompt]);
    
    




    useEffect(()=>{
      const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition

      const recognition=new SpeechRecognition()
      recognition.continuous=true;
      recognition.lang='en-IN';
      recognition.interimResults=false;

      recognitionRef.current=recognition;

      let isMounted = true;  // flag to avoid setState on unmounted component


      // start recognition after 1 sec delay only if componenet still mounted 
      const startTimeout = setTimeout(() => {
        if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
          try {
            recognition.start();
            console.log("Recognition requested to start");
          } catch (e) {
            if (e.name !== "InvalidStateError"){
              console.error(e);
            }
          }
        }
      }, 1000);


      

      const safeRecognition=()=>{
        if(!isSpeakingRef.current && !isRecognizingRef.current){
          try {
            recognition.start()
            console.log("Recognition requested to start");
          } catch (err) {
            if(err.name !== "InvalidStateError"){
              console.error("Start error: ", err)
            }
          }

        }
      }

      recognition.onstart = () => {
        isRecognizingRef.current = true;
        setListening(true);
      };

      recognition.onend = () => {
        isRecognizingRef.current = false;
        setListening(false);

        if(isMounted && !isSpeakingRef.current){
          setTimeout(() => {
            if(isMounted){
              try {
                recognition.start();
                console.log("Recognition restarted")
              } catch (e) {
                if(e.name !== "InvalidStateError") console.log(e);
              }
            }
          }, 1000);  // delay avoids rapid loop 
        }
      };

      recognition.onerror = (event) => {
        console.warn("Recognition error:", event.error);
        isRecognizingRef.current = false;
        setListening(false);
        if(event.error !== "aborted" && isMounted && !isSpeakingRef.current){
          setTimeout(() => {
            if(isMounted){
              try {
                recognition.start();
                console.log("Recognition restarted after error");
              } catch (e) {
                if(e.name !== "InavlidStateError") console.error(e);
              }
            }
          }, 1000);
        }
      };

      recognition.onresult=async (e)=>{
        const transcript=e.results[e.results.length-1][0].transcript.trim()
    

        if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
          setAiText("")
          setUserText(transcript)
          recognition.stop();
          isRecognizingRef.current=false
          setListening(false)

        const data=await getGeminiResponse(transcript)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
        }
      }

      const fallback=setInterval(()=>{
        if(!isSpeakingRef.current && !isRecognizingRef.current){
          safeRecognition()
        }
      }, 10000)
      safeRecognition();



      

      return ()=>{
        isMounted = false;
        clearTimeout(startTimeout);
        recognition.stop();
        setListening(false);
        isRecognizingRef.current=false;
      };
    },[])


    return (
      <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
      
      <TbMenuDeep className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>{setHam(true)}}/>

      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>

      <RxCross2 className=' text-white/70 absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>{setHam(false)}}/>

      <button className='bg-white/10 backdrop-blur-lg border border-white/30 text-white font-semibold px-6 py-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all duration-300' onClick={handleLogOut}>Log Out</button>


      <button className='bg-white/10 backdrop-blur-lg border border-white/30 text-white font-semibold px-6 py-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition-all duration-300' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

      <div className='w-full h-[2px] bg-gray-400 '></div>
        <h1 className='text-white font-semibold text-[25px]'>History</h1>
        <div className='w-full h-[500px] gap-[3px] overflow-y-auto flex flex-col '>{userData.history?.map((his)=>(
          <span className='text-gray-300 text-[18px] truncate'>{his}</span>
        ))
        }
        </div>
      

      </div>

      <button className='min-w-[150px] h-[60px] bg-white absolute hidden lg:block top-[20px] right-[20px] cursor-pointer rounded-full text-black font-semibold mt-10 text-[19px]' onClick={handleLogOut}>Log Out</button>

      <button className='min-w-[150px] h-[60px] bg-white absolute hidden lg:block top-[100px] right-[20px] cursor-pointer rounded-full text-black font-semibold mt-10 text-[19px] px-[20px] py-[10px]' onClick={()=>navigate("/customize")}>Customize your Assistant</button>


      
        <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden'> 
        <img src={userData?.assistantImage} alt="" className='h-full object-cover rounded-4xl shadow-lg'/>  
        </div>
        <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1> 
        {!aiText && <img src={userImg} alt="" className='w-[200px]'/>}
        {aiText && <img src={aiImg} alt="" className='w-[200px]'/>}
        
        <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>

        {showPrompt && (
  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-[100]">
    <div className="bg-[#111]/90 p-6 rounded-2xl shadow-xl text-center max-w-sm border border-white/20">
      
    
      <FancyButton  className='h-screen bg-red-800' text="Start Assistant" onClick={handleStartAssistant} />
    </div>
  </div>
)}


      </div>
    )
  }

  export default Home
