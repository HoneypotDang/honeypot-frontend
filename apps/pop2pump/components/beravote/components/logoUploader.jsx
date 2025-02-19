import React from "react";

const LogoUploader = ({ onChange, title }) => {
  return (
    <div>
      <label htmlFor="logo" style={{ color: "#fff" }}>
        {title}
      </label>
      <input
        id="logo"
        name="logo"
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ marginBottom: "20px", color: "#fff" }}
      />
      <p style={{ color: "#fff", fontSize: "12px" }}>
        Recommended size: 100x100px
      </p>
    </div>
  );
};

export default LogoUploader;
