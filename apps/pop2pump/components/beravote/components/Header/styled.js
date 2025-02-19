import { Link } from "react-router-dom";
import styled from "styled-components";

// Styled Components
export const HeaderContainer = styled.header`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.h1`
  color: white;
  font-size: 24px;
  margin: 0;
`;

export const Nav = styled.nav`
  display: flex;
`;

export const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-left: 20px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1); // Customize hover effect
  }
`;