import React from "react";
import { Input } from "antd";

const { Search } = Input;

function SearchBar({ value, onChange, placeholder="Search doctor or department" }) {
  return (
    <Search
      placeholder={placeholder}
      allowClear
      enterButton="Search"
      size="large"
      value={value}
      onChange={onChange}
      style={{ maxWidth: 300 }}
    />
  );
}

export default SearchBar;
