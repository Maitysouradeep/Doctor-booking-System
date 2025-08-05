import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Table } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";

function Appointment() {
  const [appointment, setAppointment] = useState([]);
  const dispatch = useDispatch();
  const getAppointmentData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-appointment-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointment(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNo",
      render: (text, record) => <span>{record.doctorInfo.phoneNo}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];
  useEffect(() => {
    getAppointmentData();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
      <hr/>
      <Table columns={columns} dataSource={appointment} />
    </Layout>
  );
}

export default Appointment;
