import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { DatePicker, TimePicker } from "antd";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  Wallet,
} from "lucide-react";
import Layout from "../components/Layout";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [doctor, setDoctor] = useState(null);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },
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
      toast.error("Unable to load doctor information");
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
        navigate("/appointment");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error booking appointment");
    }
  };

  const checkAvailability = async () => {
    if (!date || !time) {
      toast.error("Please select a date and time");
      return;
    }

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
      dispatch(hideLoading());
      toast.error("Error checking appointment availability");
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      {doctor && (
        <div className="booking-page">

          {/* Back button */}
          <button
            className="booking-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} />
            Back to doctors
          </button>

          {/* Page heading */}
          <div className="booking-heading">
            <div>
              <span className="booking-eyebrow">
                APPOINTMENT BOOKING
              </span>

              <h1>Book your appointment</h1>

              <p>
                Choose a convenient date and time for your consultation
                with your selected doctor.
              </p>
            </div>
          </div>

          <div className="booking-layout">

            {/* Doctor information */}
            <div className="booking-doctor-card">

              <div className="booking-doctor-cover">
                <span className="booking-verified">
                  <CheckCircle2 size={15} />
                  Verified doctor
                </span>

                <div className="booking-doctor-image-wrapper">
                  <img
                    src={
                      doctor.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="booking-doctor-image"
                  />
                </div>
              </div>

              <div className="booking-doctor-content">
                <h2>
                  Dr. {doctor.firstName} {doctor.lastName}
                </h2>

                <div className="booking-specialization">
                  <Stethoscope size={16} />
                  {doctor.specialization}
                </div>

                <div className="booking-divider" />

                <div className="booking-info-list">

                  <div className="booking-info-item">
                    <div className="booking-info-icon">
                      <MapPin size={17} />
                    </div>

                    <div>
                      <span>Location</span>
                      <strong>{doctor.address}</strong>
                    </div>
                  </div>

                  <div className="booking-info-item">
                    <div className="booking-info-icon">
                      <Phone size={17} />
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>{doctor.phoneNo}</strong>
                    </div>
                  </div>

                  <div className="booking-info-item">
                    <div className="booking-info-icon">
                      <Clock3 size={17} />
                    </div>

                    <div>
                      <span>Consultation hours</span>
                      <strong>
                        {doctor.timings?.length === 2
                          ? `${moment(
                              doctor.timings[0],
                              "HH:mm"
                            ).format("hh:mm A")} - ${moment(
                              doctor.timings[1],
                              "HH:mm"
                            ).format("hh:mm A")}`
                          : "Not available"}
                      </strong>
                    </div>
                  </div>

                  <div className="booking-info-item">
                    <div className="booking-info-icon">
                      <Wallet size={17} />
                    </div>

                    <div>
                      <span>Consultation fee</span>
                      <strong>₹{doctor.feeForconsult}</strong>
                    </div>
                  </div>

                  <div className="booking-info-item">
                    <div className="booking-info-icon">
                      <ShieldCheck size={17} />
                    </div>

                    <div>
                      <span>Experience</span>
                      <strong>{doctor.experience}</strong>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Booking panel */}
            <div className="booking-panel">

              <div className="booking-panel-header">
                <div className="booking-panel-icon">
                  <CalendarDays size={22} />
                </div>

                <div>
                  <h2>Select your appointment</h2>
                  <p>
                    Pick a date and time that works for you.
                  </p>
                </div>
              </div>

              <div className="booking-form">

                <div className="booking-field">
                  <label>
                    Appointment date
                  </label>

                  <DatePicker
                    format="DD-MM-YYYY"
                    placeholder="Select a date"
                    size="large"
                    className="booking-picker"
                    disabledDate={(current) =>
                      current &&
                      current < moment().startOf("day")
                    }
                    onChange={(value) => {
                      setIsAvailable(false);

                      if (value) {
                        setDate(moment(value).format("DD-MM-YYYY"));
                      } else {
                        setDate("");
                      }
                    }}
                  />
                </div>

                <div className="booking-field">
                  <label>
                    Appointment time
                  </label>

                  <TimePicker
                    format="HH:mm"
                    placeholder="Select a time"
                    size="large"
                    className="booking-picker"
                    onChange={(value) => {
                      setIsAvailable(false);

                      if (value) {
                        setTime(value.format("HH:mm"));
                      } else {
                        setTime("");
                      }
                    }}
                  />
                </div>

                <button
                  className="booking-check-button"
                  onClick={checkAvailability}
                >
                  <CalendarDays size={18} />
                  Check availability
                </button>

                {isAvailable && (
                  <div className="booking-available">
                    <div>
                      <CheckCircle2 size={21} />
                    </div>

                    <div>
                      <strong>Time slot available</strong>
                      <span>
                        Your selected appointment slot is available.
                      </span>
                    </div>
                  </div>
                )}

                {isAvailable && (
                  <button
                    className="booking-confirm-button"
                    onClick={bookNow}
                  >
                    Confirm appointment
                    <ArrowLeft
                      size={18}
                      style={{ transform: "rotate(180deg)" }}
                    />
                  </button>
                )}

                <p className="booking-note">
                  You can track your appointment status from the
                  Appointments section after booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;