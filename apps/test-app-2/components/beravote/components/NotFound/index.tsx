import React from 'react';
import { Container, HomeLink, Message, Title } from './styled';

const NotFound = () => {
  return (
    <Container>
      <Title>404 - Page Not Found</Title>
      <Message>The page you are looking for does not exist.</Message>
      <HomeLink href="/">Go back to Home</HomeLink>
    </Container>
  );
};

export default NotFound;
