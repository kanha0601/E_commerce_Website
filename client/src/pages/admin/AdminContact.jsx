import React, { useEffect, useState } from 'react';
import axios from "axios";

function AdminContact() {
    const url =import.meta.env.VITE_BACKEND_URL;

    const [contact,setContact]=useState([]);

    console.log(contact);

const fetchContact = async()=>{
    try {
        const getUrl=url+"/contact/get";
        const res = await axios.get(getUrl);
        if (res.data.status){
            setContact(res.data.contact);
        }
    } catch (err) {
        console.log(err)
    }
    
}

useEffect(()=>{
    fetchContact()
},[])
  return (
    <div>
        <table className='w-full'> 
            <thead className='border bg-yellow-400'>
                <tr>
                    <td>Name</td>
                    <td>Email</td>
                    <td>Phone</td>
                    <td>Message</td>
                </tr>
            </thead>
            <tbody>
       
          {contact?.length > 0 &&
            contact.map((ele) => (
              <tr>
                <td>{ele?.name}</td>
                <td>{ele.email}</td>
                <td>{ele.phone}</td>
                <td>{ele.message}</td>
              </tr>
            ))}
        
            </tbody>
        </table>
    </div>
  )
}

export default AdminContact