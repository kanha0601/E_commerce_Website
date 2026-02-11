import React, { useState } from 'react'
import axios from "axios";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setphone] = useState("");
  const [message, setmessage] = useState("");

  const url = import.meta.env.VITE_BACKEND_URL

  const handleSubmit = async () => {
    try {
      const postUrl = url + "/contact/add"

      const res = await axios.post(postUrl, {
        name: name,
        "email": email,
        phone,
        message,
      })
      console.log(res?.data);

      if(res?.data?.status){
        alert(res?.data?.message);
        setName("")
        setEmail("")
        setmessage("")
        setphone("")
      }else{
        alert("something went wrong")
      }

    } catch (err) {
      console.log(err);
    }

  };
  return (
    <div className=' grid gap-2 w-1/2 m-auto p-3 shadow-xl rounded-2xl'>
      <input className="input-edfgh" placeholder='enter name' onChange={(e) => setName(e.target.value)} value={name} />
      <input className="input-edfgh" placeholder='enter email' onChange={(e) => setEmail(e.target.value)}  value={email}/>
      <input className="input-edfgh" placeholder='enter number' onChange={(e) => setphone(e.target.value)}  value={phone}/>
      <input className="input-edfgh" placeholder='enter message' onChange={(e) => setmessage(e.target.value)} value={message} />
      <button onClick={handleSubmit} className='bg-blue-400 p-1 ronded'>submit</button>

    </div>
  )
}

export default Contact;