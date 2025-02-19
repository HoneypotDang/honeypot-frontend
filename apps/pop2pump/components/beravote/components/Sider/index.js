import React, { useState } from "react";
import { SiderContainer, SiderHeader, MenuItem, SiderFooter } from "./styled"; // Import styled-components

const Sider = () => {
  const [activeItem, setActiveItem] = useState("Summary");

  const menuItems = ["Summary", "Details", "Statistics", "Settings"];

  return (
    <SiderContainer>
      <div>
        <SiderHeader>Menu</SiderHeader>
        {menuItems.map((item) => (
          <MenuItem
            key={item}
            isActive={item === activeItem}
            onClick={() => setActiveItem(item)}
          >
            {item}
          </MenuItem>
        ))}
      </div>
      <SiderFooter>&copy; 2024 Your Company</SiderFooter>
    </SiderContainer>
  );
};

export default Sider;
