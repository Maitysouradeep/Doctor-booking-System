import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import DoctorForm from "../../components/DoctorForm";
import moment from "moment";
import {
  ArrowLeft,
  CheckCircle2,
  Stethoscope,
  UserRound,
} from "lucide-react";

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/doctor/update-doctor-profile",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
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
        toast("Redirecting to the home page");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-user-id",
        { userId: params.userId },
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
      toast.error("Unable to load doctor profile");
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      <div className="doctor-profile-page">

        {/* Back */}
        <button
          className="profile-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        {/* Header */}
        <div className="doctor-profile-header">

          <div className="doctor-profile-heading">
            <div className="doctor-profile-icon">
              <Stethoscope size={25} />
            </div>

            <div>
              <span className="doctor-profile-eyebrow">
                DOCTOR ACCOUNT
              </span>

              <h1>Doctor Profile</h1>

              <p>
                Manage your professional information and consultation
                details.
              </p>
            </div>
          </div>

          {doctor && (
            <div className="doctor-profile-status">
              {doctor.isVerified ? (
                <>
                  <CheckCircle2 size={17} />
                  Verified Doctor
                </>
              ) : (
                <>
                  <UserRound size={17} />
                  Profile Pending
                </>
              )}
            </div>
          )}
        </div>

        {/* Form */}
        {doctor && (
          <div className="doctor-profile-form-card">
            <div className="doctor-profile-form-header">
              <div>
                <h2>Professional information</h2>
                <p>
                  Keep your information updated so patients can find
                  accurate details about you.
                </p>
              </div>
            </div>

            <div className="doctor-profile-form-body">
              <DoctorForm
                onFinish={onFinish}
                initialValues={doctor}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Profile;