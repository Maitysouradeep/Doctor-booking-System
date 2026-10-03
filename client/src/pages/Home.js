import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import axios from "axios";
import Layout from "../components/Layout";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { Search, SlidersHorizontal, X } from "lucide-react";

function Home() {
  const [doctor, setDoctor] = useState([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.get(
        "/api/user/get-all-approved-doctors",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
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

  useEffect(() => {
    getData();
  }, []);

  // Get unique doctor specializations
  const specializations = [
    "All",
    ...new Set(
      doctor
        .map((item) => item.specialization)
        .filter(Boolean)
    ),
  ];

  // Filter doctors
  const filteredDoctors = doctor.filter((item) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      `${item.firstName} ${item.lastName}`
        .toLowerCase()
        .includes(searchText) ||
      item.specialization?.toLowerCase().includes(searchText) ||
      item.address?.toLowerCase().includes(searchText);

    const matchesSpecialization =
      specialization === "All" ||
      item.specialization === specialization;

    return matchesSearch && matchesSpecialization;
  });

  const clearSearch = () => {
    setSearch("");
    setSpecialization("All");
  };

  return (
    <Layout>
      <div className="home-page">

        {/* Search Header */}
        <div className="doctor-search-section">
          <div className="doctor-search-heading">
            <div>
              <span className="doctor-search-eyebrow">
                FIND YOUR DOCTOR
              </span>

              <h1>Find the right doctor for you</h1>

              <p>
                Search by doctor name, specialization, or location.
              </p>
            </div>

            <div className="doctor-search-count">
              <strong>{filteredDoctors.length}</strong>
              <span>Doctors available</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="doctor-search-bar">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search doctor, specialization or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="doctor-search-clear"
                onClick={() => setSearch("")}
                type="button"
              >
                <X size={17} />
              </button>
            )}

            <button
              className="doctor-search-button"
              type="button"
            >
              <Search size={17} />
              Search
            </button>
          </div>

          {/* Specialization Filters */}
          <div className="doctor-filter-row">
            <div className="doctor-filter-label">
              <SlidersHorizontal size={16} />
              <span>Specialization</span>
            </div>

            <div className="doctor-filter-pills">
              {specializations.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`doctor-filter-pill ${
                    specialization === item ? "active" : ""
                  }`}
                  onClick={() => setSpecialization(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            {(search || specialization !== "All") && (
              <button
                className="doctor-reset-button"
                onClick={clearSearch}
                type="button"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Doctors */}
        <div className="home-doctors-header">
          <div>
            <span className="home-doctors-eyebrow">
              AVAILABLE DOCTORS
            </span>
            <h2>Our doctors</h2>
          </div>

          <span className="home-doctors-result">
            {filteredDoctors.length} result
            {filteredDoctors.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredDoctors.length > 0 ? (
          <Row gutter={[20, 20]}>
            {filteredDoctors.map((doctor) => (
              <Col
                key={doctor._id}
                span={8}
                xs={24}
                sm={24}
                md={12}
                lg={8}
              >
                <Doctor doctor={doctor} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="doctor-search-empty">
            <div className="doctor-search-empty-icon">
              <Search size={28} />
            </div>

            <h3>No doctors found</h3>

            <p>
              Try searching with a different name, specialization,
              or location.
            </p>

            <button
              type="button"
              onClick={clearSearch}
              className="doctor-reset-button"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;