import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import {toast} from 'react-hot-toast';
import axios from "axios";
import moment from 'moment'
function Doctorslist() {
  const [doctor, setDoctor] = useState([]);
  const dispatch = useDispatch();
  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
   const changeDoctorStatus = async (record,status)=> {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/admin/change-doctor-account-status",{doctorId:record._id,userId:record.userId,status:status},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message)
        getDoctorsData();
      }
    } catch (error) {
      toast.error('error changing doctor account status')
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => <span>{record.firstName} {record.lastname}</span> 
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record,text) => moment(record.createdAt).format('DD-MM-YYYY'),
    },
    {
      title:"Phone",
      dataIndex:"phoneNo",
    },
    {
      title:"Status",
      dataIndex:"status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status==="Pending" && <h1 className="anchor" onClick={()=>changeDoctorStatus(record,'Approved')}>Approve</h1>}
          {record.status==="Approved" && <h1 className="anchor" onClick={()=>changeDoctorStatus(record,'Blocked')}>Block</h1>}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-header">Doctors List</h1>
      <hr/>
      <Table columns={columns} dataSource={doctor} />
    </Layout>
  );
}

export default Doctorslist;
