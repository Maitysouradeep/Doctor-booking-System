import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd'; 
import axios from 'axios';
import Layout from '../components/Layout';
import Doctor from '../components/Doctor';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';



function Home() {
  const [doctor,setDoctor]=useState([])
  const dispatch=useDispatch();
  const getData=async()=>{
    try{
      dispatch(showLoading())
      const response=await axios.get('/api/user/get-all-approved-doctors',{
        headers:{
        Authorization:"Bearer "+localStorage.getItem('token')
      }
    });
    dispatch(hideLoading())
    if(response.data.success){
      setDoctor(response.data.data);
    }
  }
    catch(error){
      dispatch(hideLoading())
    }
  };
  useEffect(()=>{
    getData();
  },[]);
  return (
    <Layout>
      <Row gutter={20}>
        {doctor.map((doctor)=>(
          <Col span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor}/>
          </Col>
        ))}
      </Row>
    </Layout>
  )
}

export default Home
