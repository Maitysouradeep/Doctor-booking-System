import { Link ,useNavigate} from 'react-router-dom'; 
import {Form,Input} from 'antd'
import toast from 'react-hot-toast'
import React from 'react'
import {useDispatch} from 'react-redux';
import axios from 'axios'
import { hideLoading, showLoading } from '../redux/alertsSlice';

export default function Login() {
const dispatch=useDispatch();
const navigate=useNavigate();
const onFinish = async(values)=>{
   try{
    dispatch(showLoading());
    const response=await axios.post('/api/user/login',values);
    dispatch(hideLoading());
    if(response.data.success){
      toast.success(response.data.message);
      localStorage.setItem("token",response.data.data);
      navigate("/");
    }
    else{
      toast.error(response.data.message);
    }
  }
  catch(error){
    dispatch(hideLoading());
    toast.error('something went wrong');
  }
}  
  return (
    <div className='authentication'>
      <div className='authentication-form card p-3'>
        <h1 className='card-title'>Welcome Back</h1>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Email' name='email'>
            <Input placeholder='Email'/>
          </Form.Item>
          <Form.Item label='Password' name='password'>
            <Input placeholder='Password'type='password'/>
          </Form.Item>
           <button className='primary-button mt-2 full-width-button'htmlType='submit'>LOGIN</button>
                     <div className='mt-2'>
            Don't have an account? <Link to='/register'className='anchor'>Click here to Register</Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

