import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [msg,setmsg] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null)
  const mailRef = useRef<HTMLInputElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const webSocket = () => {
    if(wsRef.current) return
    const ws = new WebSocket("ws://localhost:8080")
    ws.onopen = () => {
      console.log("connection established")
      wsRef.current = ws;
    }

    ws.onmessage = (e) => {
      try{
        const data = JSON.parse(e.data)
        if(data.type === "chat"){
          setmsg((m)=> [...m,data.payload.message].join(''))
        } 
      }
      catch (error){
        setmsg((m) => [...m,e.data].join(''))
      }
    }

    ws.onclose = () => {
      console.log("connection closed")
      wsRef.current = null
      setTimeout(webSocket,1000)
    }
  }

  useEffect(() => {
    webSocket()
    
    return () => {
      if (wsRef.current){
        wsRef.current.close()
        wsRef.current = null;
      }
    }
  },[])

  function Messages(){
    console.log(msg)
    return<div>
      
      
    </div>
  }

  function Homepage(){

      return <div className='flex flex-col justify-center items-center'>
        <div>
          <span className='font-semibold text-3xl'>How Can I help You ?</span>
        </div>
        <input ref={mailRef} type="text" placeholder='Email ID' />
        <div>
          <input ref={inputRef} placeholder='Ask Anything...' type="text" className='outline-none p-5 md:p-7 text-base border-none rounded-t-3xl mt-10 w-[65vw]  ' />
          <div className='bg-white rounded-b-3xl flex justify-end px-8 pb-2'>
            <button onClick={() => {
              const message = inputRef.current?.value;
              if (!message || message.length === 0){
                alert("Input field is empty")
              }else if (mailRef.current?.value.length === 0){
                alert("Please Enter your MailID")
              }
              wsRef.current?.send(
                JSON.stringify({
                  mailid:mailRef.current?.value,
                  type: "chat",
                  payload: {
                    message: message!, 
                  },
                })
              );
              
            }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzJcLqzRWYxqFQZ2UiEhbaefrcM5j9vV4DAA&s" alt="plus_ico" className='w-5 rounded-4xl' />
            </button>
          </div>

        </div>
      </div>
  }

  return (
    <div className='flex justify-center items-center h-screen '>
      {msg.length>0?<Messages/> : <Homepage/>}
      
    </div>
  )
}

export default App
