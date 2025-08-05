import Layout from "../components/Layout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import { DatePicker, TimePicker, Row, Col, Button } from "antd";
function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate=useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/appointment')
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };
  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row gutter={20} className="mt-5"align="middle">
            <Col span={12} sm={24} xs={24} lg={8}>
              <img
                src="https://www.shutterstock.com/image-vector/book-now-hand-point-icon-600nw-2482245385.jpg"
                alt=""
                width='100%'
                height={450}
              />
            </Col>
            <Col span={12} sm={24} xs={24} lg={8}>
              <h1 className="normal-text">
                <b>Consulting time:</b>
                {doctor.timings[0]}-{doctor.timings[1]}
              </h1>
              <p>
                <b>Phone Number:</b>
                {doctor.phoneNo}
              </p>
              <p>
                <b>Address:</b>
                {doctor.address}
              </p>
              <p>
                <b>Fee for consult:</b>
                {doctor.feeForconsult}
              </p>
              <p>
                <b>Experience:</b>
                {doctor.experience}
              </p>
              <p>
                <b>Specialization:</b>
                {doctor.specialization}
              </p>
              <div className="d-flex flex-column pt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setDate(moment(value).format("DD-MM-YYYY"));
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    if (value) {
                      const selectedTime = value.format("HH:mm");
                      setTime(selectedTime);
                    } else {
                      setTime("");
                    }
                  }}
                />

                <Button
                  className="primary-button mt-3 full-width-button"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>
                {isAvailable && (
                  <Button
                    className="primary-button mt-3 full-width-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
