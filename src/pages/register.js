import { Link, useNavigate } from 'react-router-dom'; 
import {Form,Input} from 'antd'
import React from 'react'
import {useDispatch} from 'react-redux';
import axios from 'axios'
import toast from 'react-hot-toast'
import { hideLoading, showLoading } from '../redux/alertsSlice';

export default function Register() {
const dispatch=useDispatch();
const navigate=useNavigate();
const onFinish = async(values)=>{
  try{
    dispatch(showLoading());
    const response=await axios.post('/api/user/register',values);
    dispatch(hideLoading());
    if(response.data.success){
      toast.success(response.data.message);
      navigate('/login');
    }
    else{
      toast.error(response.data.message);
    }
  }
  catch(error){
    dispatch(hideLoading());
    console.log(error);
    toast.error('something went wrong');
  }
}  
  return (
    <div className='authentication'>
      <div className='authentication-form card p-3'>
        <h1 className='card-title'>Glad to meet U</h1>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Name' name='name'>
            <Input placeholder='Name'/>
          </Form.Item>
          <Form.Item label='Email' name='email'>
            <Input placeholder='Email'/>
          </Form.Item>
          <Form.Item label='Password' name='password'>
            <Input placeholder='Password'type='password'/>
          </Form.Item>
           <button className='primary-button mt-2 full-width-button'htmlType='submit'>REGISTER</button>
                     <div className='mt-2'>
            Already have an account? <Link to='/login'className='anchor'>Click here to Login</Link>
          </div>
        </Form>
      </div>
    </div>
  )
}
