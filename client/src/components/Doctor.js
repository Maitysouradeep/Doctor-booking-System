import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import moment from "moment";

function Doctor({ doctor }) {
  const navigate = useNavigate();

  const visitingTime =
    doctor.timings && doctor.timings.length === 2
      ? `${moment(doctor.timings[0], "HH:mm").format("hh:mm A")} - ${moment(
          doctor.timings[1],
          "HH:mm"
        ).format("hh:mm A")}`
      : "Not Set";

  return (
    <div
      className="doctor-card"
      onClick={() => navigate(`/book-appointment/${doctor._id}`)}
    >
      {/* Doctor Image */}
      <div className="doctor-image-wrapper">
        <img
          src={
            doctor.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt={`${doctor.firstName} ${doctor.lastName}`}
          className="doctor-profile-pic"
        />

        {doctor.isVerified && (
          <div className="doctor-verified-badge">
            <FaCheckCircle />
            <span>Verified</span>
          </div>
        )}

        <div className="doctor-arrow">
          <FiArrowUpRight />
        </div>
      </div>

      {/* Doctor Information */}
      <div className="doctor-card-content">
        <div className="doctor-name-row">
          <div>
            <h2>
              Dr. {doctor.firstName} {doctor.lastName}
            </h2>

            <p className="doctor-specialization">
              {doctor.specialization}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="doctor-details">
          <div className="doctor-detail">
            <FaMapMarkerAlt />
            <span>{doctor.address}</span>
          </div>

          <div className="doctor-detail">
            <FaClock />
            <span>{visitingTime}</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="doctor-card-footer">
          <div>
            <span className="doctor-fee-label">Consultation</span>
            <strong>₹{doctor.feeForconsult}</strong>
          </div>

          <button
            className="doctor-book-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/book-appointment/${doctor._id}`);
            }}
          >
            Book appointment
            <FiArrowUpRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Doctor;