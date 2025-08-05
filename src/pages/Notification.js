import Layout  from '../components/Layout'
import React from 'react'
import {Tabs } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading,hideLoading } from '../redux/alertsSlice';
import {setUser} from '../redux/userSlice';

function Notification() {
  const {user}=useSelector((state)=>state.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const markallasseen=async()=>{
      try{
        dispatch(showLoading());
        const response=await axios.post('/api/user/mark-all-notification-as-seen',{userId:user._id},{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        });
        dispatch(hideLoading());
        if(response.data.success){
          toast.success(response.data.message);
          dispatch(setUser(response.data.data))
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

  const deleteall=async()=>{
      try{
        dispatch(showLoading());
        const response=await axios.post('/api/user/delete-all-notification',{userId:user._id},{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        });
        dispatch(hideLoading());
        if(response.data.success){
          toast.success(response.data.message);
          dispatch(setUser(response.data.data))
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
    <Layout>
        <h1 className='page-title'>Notification</h1>
        <hr/>
        <Tabs>
          <Tabs.TabPane tab='unseen' key={0}>
            <div className='d-flex justify-content-end'>
              <h1 className='anchor'onClick={()=>markallasseen()}>Mark all as seen
              </h1>
            </div>
            {user?.unseenNotification.map((notification)=>(
              <div className='card p-2 mt-2'onClick={()=>navigate(notification.onClickPath)}>
                <div className='card-text'>{notification.message}</div>
              </div>
            ))}
          </Tabs.TabPane>
           <Tabs.TabPane tab='seen'key={1}>
            <div className='d-flex justify-content-end'>
              <h1 className='anchor'onClick={()=>deleteall()}>Delete all
              </h1>
            </div>
              {user?.seenNotification.map((notification)=>(
              <div className='card p-2 mt-2'onClick={()=>navigate(notification.onClickPath)}>
                <div className='card-text'>{notification.message}</div>
              </div>
            ))}
          </Tabs.TabPane>
        </Tabs>
    </Layout>
  )
}

export default Notification
