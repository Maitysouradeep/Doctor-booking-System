import React, { useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  TimePicker,
  Input,
  Upload,
  Select,
} from "antd";
import {
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import moment from "moment";
import axios from "axios";

function DoctorForm({ onFinish, initialValues }) {
  const [profilePicUrl, setProfilePicUrl] = useState(
    initialValues?.profilePic || ""
  );

  const [certificateUrls, setCertificateUrls] = useState(
    initialValues?.certificates || []
  );

  // Upload to Cloudinary
  const handleUpload = async (file, type) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "doctor_uploads");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/du0cjkqnx/upload",
      formData
    );

    if (type === "profile") {
      setProfilePicUrl(res.data.secure_url);
    } else {
      setCertificateUrls([
        ...certificateUrls,
        res.data.secure_url,
      ]);
    }
  };

  const handleFinish = (values) => {
    onFinish({
      ...values,
      profilePic: profilePicUrl,
      certificates: certificateUrls,
    });
  };

  const formattedInitialValues = {
    ...initialValues,
    ...(initialValues?.timings && {
      timings: [
        moment(initialValues.timings[0], "HH:mm"),
        moment(initialValues.timings[1], "HH:mm"),
      ],
    }),
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      initialValues={formattedInitialValues}
      className="doctor-form"
    >

      {/* =========================================
          PERSONAL INFORMATION
      ========================================= */}

      <div className="doctor-form-section">
        <div className="doctor-form-section-header">
          <div className="doctor-form-section-number">
            01
          </div>

          <div>
            <h3>Personal information</h3>
            <p>
              Basic details that patients can use to identify and
              contact you.
            </p>
          </div>
        </div>

        <Row gutter={[20, 4]}>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder="First Name"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder="Last Name"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Phone Number"
              name="phoneNo"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder="Phone Number"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Website"
              name="website"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder="https://yourwebsite.com"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder="Clinic / Hospital address"
              />
            </Form.Item>
          </Col>

          {/* Profile picture */}

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Profile Picture"
              name="profilePic"
            >
              <Upload
                beforeUpload={(file) => {
                  handleUpload(file, "profile");
                  return false;
                }}
                listType="picture"
                maxCount={1}
                showUploadList={false}
              >
                <button
                  type="button"
                  className="doctor-upload-button"
                >
                  <UploadOutlined />
                  Upload profile picture
                </button>
              </Upload>

              {profilePicUrl && (
                <div className="doctor-profile-preview">
                  <img
                    src={profilePicUrl}
                    alt="Doctor profile"
                  />

                  <div>
                    <strong>Profile picture uploaded</strong>
                    <span>Cloudinary image</span>
                  </div>
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
      </div>


      {/* =========================================
          PROFESSIONAL INFORMATION
      ========================================= */}

      <div className="doctor-form-section">

        <div className="doctor-form-section-header">
          <div className="doctor-form-section-number">
            02
          </div>

          <div>
            <h3>Professional information</h3>
            <p>
              Tell patients about your medical expertise and
              consultation details.
            </p>
          </div>
        </div>

        <Row gutter={[20, 4]}>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Specialization"
              name="specialization"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder="e.g. Cardiologist"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Experience"
              name="experience"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                type="number"
                placeholder="Years of experience"
                suffix="years"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Consultation Fee"
              name="feeForconsult"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                type="number"
                placeholder="Consultation fee"
                prefix="₹"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Consultation Timings"
              name="timings"
              rules={[{ required: true }]}
            >
              <TimePicker.RangePicker
                format="HH:mm"
                minuteStep={5}
                size="large"
                className="doctor-time-picker"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Medical License Number"
              name="licenseNo"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder="Enter license number"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Education"
              name="education"
              rules={[{ required: true }]}
            >
              <Input
                size="large"
                placeholder="Degrees, Universities"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Languages Spoken"
              name="languages"
            >
              <Select
                mode="multiple"
                size="large"
                placeholder="Select languages"
                allowClear
                options={[
                  { value: "English", label: "English" },
                  { value: "Hindi", label: "Hindi" },
                  { value: "Bengali", label: "Bengali" },
                  { value: "Telugu", label: "Telugu" },
                  { value: "Marathi", label: "Marathi" },
                  { value: "Tamil", label: "Tamil" },
                  { value: "Gujarati", label: "Gujarati" },
                  { value: "Urdu", label: "Urdu" },
                  { value: "Kannada", label: "Kannada" },
                  { value: "Odia", label: "Odia" },
                  { value: "Punjabi", label: "Punjabi" },
                  { value: "Malayalam", label: "Malayalam" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </Form.Item>
          </Col>

        </Row>
      </div>


      {/* =========================================
          DOCUMENTS
      ========================================= */}

      <div className="doctor-form-section">

        <div className="doctor-form-section-header">
          <div className="doctor-form-section-number">
            03
          </div>

          <div>
            <h3>Certificates & verification</h3>
            <p>
              Upload your certificates or identification documents
              for verification.
            </p>
          </div>
        </div>

        <Form.Item
          label="Certificates / ID Proof"
          name="certificates"
        >
          <Upload.Dragger
            beforeUpload={(file) => {
              handleUpload(file, "certificate");
              return false;
            }}
            multiple
            showUploadList={false}
          >
            <div className="doctor-dragger-content">
              <div className="doctor-dragger-icon">
                <InboxOutlined />
              </div>

              <h4>Upload documents</h4>

              <p>
                Click or drag files here to upload
              </p>

              <span>
                Certificates, ID proof and other supporting documents
              </span>
            </div>
          </Upload.Dragger>
        </Form.Item>

        {certificateUrls.length > 0 && (
          <div className="doctor-certificates-list">

            <div className="doctor-certificates-title">
              Uploaded documents
            </div>

            {certificateUrls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="doctor-certificate-item"
              >
                <span className="doctor-certificate-number">
                  {index + 1}
                </span>

                <span>
                  Certificate / Document {index + 1}
                </span>

                <span className="doctor-certificate-view">
                  View
                </span>
              </a>
            ))}

          </div>
        )}
      </div>


      {/* =========================================
          SUBMIT
      ========================================= */}

      <div className="doctor-form-actions">

        <div>
          <strong>Ready to save your profile?</strong>
          <span>
            Make sure all professional details are accurate.
          </span>
        </div>

        <Button
          className="doctor-form-submit"
          htmlType="submit"
          size="large"
        >
          Save profile
        </Button>

      </div>

    </Form>
  );
}

export default DoctorForm;