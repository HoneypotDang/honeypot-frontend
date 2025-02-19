import styled from 'styled-components';

// Styled Components
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; // Full viewport height
  background-color: #f8f9fa; // Light background
  color: #343a40; // Dark text color
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
`;

export const Message = styled.p`
  font-size: 1.5rem;
  margin: 10px 0;
`;

export const HomeLink = styled.a`
  margin-top: 20px;
  font-size: 1.2rem;
  color: #007bff; // Bootstrap primary color
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;