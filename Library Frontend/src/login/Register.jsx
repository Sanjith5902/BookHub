import { useState } from 'react'
import { Routes, Route ,Link} from "react-router";
import './register.css'
import axios from 'axios';

function Register() {
    const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const[result,setResult]=useState({})
  const [email, setEmail] = useState("")

async function  Checkpassword() {
  


   
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let err = {}
    if (!passwordRegex.test(password)) {
      err.password = "Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character";
    //   return;
    }
    
 const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(name)) {
      err.name = "Name must contain only letters";
    }
   
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    err.email = "Please enter a valid email address";
    // return;
  }
  if (password === "" || confirmPassword === "") {
    err.password = "Enter password";
  }
  else if (password !== confirmPassword) {
    err.password = "Passwords do not match";
  }
  if(phone.length>10){
    err.phone="number must be in 10 digits"
  }
  if (Object.keys(err).length === 0) {
const response = await axios.post(
    'http://localhost:3000/register',
    {
        name: name,
        number: phone,
        email: email,
        password: password,
        
    }
);
    err.success = response.data.message;
  }
  setResult({...err});
}

  return (
    <div className='register_container'>
          <h2 className='register_head'>Registration</h2>
            <input className='register_input' type='text' value={name} placeholder='enter name' onChange={(e)=>setName(e.target.value)}/><br></br>
            {result.name && <p style={{color: 'red'}}>{result.name}</p>}
             <input className='register_input' type='number' value={phone} placeholder='enter number' onChange={(e)=>setPhone(e.target.value)}/><br></br>
            {result.name && <p style={{color: 'red'}}>{result.number2}</p>}
          <input className='register_input' type='email' value={email} placeholder='enter email' onChange={(e)=>setEmail(e.target.value)}/><br></br>
          {result.email && <p style={{color: 'red'}}>{result.email}</p>}
         <input className='register_input' type='text' value={password} placeholder='enter password' onChange={(e)=>setPassword(e.target.value)}/><br></br>
        <input className='register_input' type='text' value={confirmPassword} placeholder='confirm password' onChange={(e)=>setConfirmPassword(e.target.value)}/><br></br>
            {result.password && <p style={{color: 'red'}}>{result.password}</p>}
       { result.success && <p style={{color: 'green'}}>{result.success}</p>}
       <div>
        <button className='register_button'
          type="button"
          onClick={Checkpassword} style={{ margin: '5px' }} >
          Register
        </button >
           <Link to="/">
       <button className='register_button1' >
        Login
      </button>
       </Link>
        {/* <h3>{result}</h3> */}
        </div>
    </div>
  );
}
export default Register;