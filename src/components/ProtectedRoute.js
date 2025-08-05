import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { setUser } from '../redux/userSlice';
function ProtectedRoute(props) {
const {user}=useSelector((state)=>state.user)
const dispatch=useDispatch()
const navigate=useNavigate()
const getUser=async()=>{
try{
   dispatch(showLoading())
   const response=await axios.post('/api/user/get-user-info-by-id',{},{
      headers:{
         Authorization:`Bearer ${localStorage.getItem('token')}`,
      }
   });
   dispatch(hideLoading());
   if(response.data.success){
      dispatch(setUser(response.data.data))
   }
   else{
      localStorage.clear();
      navigate('/login')
   }

}
catch(error){
   localStorage.clear();
   dispatch(hideLoading())
   console.error("Error fetching user info:", error.message);
   localStorage.removeItem("token");
   navigate('/login')
}
}
useEffect(()=>{
   if(!user){
      getUser()
   }
   
},[user])
 if(localStorage.getItem('token')){
    return props.children;
 }else{
    return <Navigate to ='/login'/>
 }
}

export default ProtectedRoute