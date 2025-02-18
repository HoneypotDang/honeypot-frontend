import styled from "styled-components";

// Sider Container
export const SiderContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #121212;
  color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
`;

// Sider Header
export const SiderHeader = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

// Sider Menu Items
export const MenuItem = styled.div`
  padding: 10px 15px;
  margin: 10px 0;
  cursor: pointer;
  font-size: 1.1rem;
  color: ${({ isActive }) => (isActive ? "#5846ff" : "#ffffff")};
  background-color: ${({ isActive }) => (isActive ? "#1e1e1e" : "transparent")};
  border-radius: 5px;

  &:hover {
    background-color: #1e1e1e;
  }
`;

// Footer (Optional)
export const SiderFooter = styled.div`
  font-size: 0.8rem;
  text-align: center;
  color: #888;
`;
