import React from 'react';
import { HeaderContainer, Logo, Nav, StyledLink } from './styled';
import { ConnectWallet } from '@thirdweb-dev/react';

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>MyApp</Logo>
      <Nav>
        <ConnectWallet />
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
