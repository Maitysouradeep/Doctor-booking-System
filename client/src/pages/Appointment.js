import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Table, Tag } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import axios from "axios";
import moment from "moment";
import { CalendarDays, Clock3, Phone, UserRound } from "lucide-react";

function Appointment() {
  const [appointment, setAppointment] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get(
        "/api/user/get-appointment-by-user-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (response.data.success) {
        setAppointment(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const getStatusTag = (status) => {
    const statusMap = {
      Approved: {
        color: "success",
        label: "Approved",
      },
      Rejected: {
        color: "error",
        label: "Rejected",
      },
      pending: {
        color: "warning",
        label: "Pending",
      },
    };

    const current = statusMap[status] || {
      color: "default",
      label: status,
    };

    return <Tag color={current.color}>{current.label}</Tag>;
  };

  const columns = [
    {
      title: "Doctor",
      key: "doctor",
      render: (_, record) => (
        <div className="appointment-doctor">
          <div className="appointment-doctor-avatar">
            <UserRound size={19} />
          </div>

          <div>
            <div className="appointment-doctor-name">
              Dr. {record.doctorInfo.firstName}{" "}
              {record.doctorInfo.lastName}
            </div>

            <div className="appointment-doctor-specialization">
              {record.doctorInfo.specialization || "Medical Specialist"}
            </div>
          </div>
        </div>
      ),
    },

    {
      title: "Appointment",
      key: "appointment",
      render: (_, record) => (
        <div className="appointment-date-time">
          <div>
            <CalendarDays size={16} />
            <span>{moment(record.date).format("DD MMM YYYY")}</span>
          </div>

          <div>
            <Clock3 size={16} />
            <span>{moment(record.time, "HH:mm").format("hh:mm A")}</span>
          </div>
        </div>
      ),
    },

    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div className="appointment-phone">
          <Phone size={16} />
          <span>{record.doctorInfo.phoneNo}</span>
        </div>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
  ];

  useEffect(() => {
    getAppointmentData();
  }, []);

  return (
    <Layout>
      <div className="appointments-page">

        {/* Header */}
        <div className="appointments-header">
          <div>
            <span className="appointments-eyebrow">
              YOUR HEALTHCARE
            </span>

            <h1>Appointments</h1>

            <p>
              Manage your upcoming appointments and keep track of
              your healthcare visits.
            </p>
          </div>

          <div className="appointments-count">
            <span>{appointment.length}</span>
            <small>Total appointments</small>
          </div>
        </div>

        {/* Appointment table */}
        <div className="appointments-card">
          <Table
            columns={columns}
            dataSource={appointment}
            rowKey="_id"
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true,
            }}
            locale={{
              emptyText: (
                <div className="appointments-empty">
                  <CalendarDays size={38} />
                  <h3>No appointments yet</h3>
                  <p>
                    Your booked appointments will appear here.
                  </p>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Appointment;