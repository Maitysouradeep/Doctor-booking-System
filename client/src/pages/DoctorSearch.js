// client/src/pages/DoctorSearch.js
import React, { useState, useEffect } from "react";
import SearchBar from "../components/Search";
import Layout from "../components/Layout";
import axios from "axios";

function DoctorSearch() {
  const [searchText, setSearchText] = useState("");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("/api/doctor/get-all-doctors").then((res) => {
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    });
  }, []);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
        <SearchBar
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search doctor or department"
        />
      </div>
      <div className="doctor-list">
        {filteredDoctors.map((doc) => (
          <div key={doc._id}>
            <h3>{doc.firstName} {doc.lastName}</h3>
            <p><b>Specialization:</b> {doc.specialization}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default DoctorSearch;

