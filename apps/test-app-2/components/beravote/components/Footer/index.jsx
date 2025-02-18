import React from "react";
import { ReactComponent as FooterLogoSvg } from "../../assets/images/beravote-logo.svg";
import { ReactComponent as GithubSvg } from "../../assets/icons/github.svg";
import { ReactComponent as DiscordSvg } from "../../assets/icons/discord.svg";
import { ReactComponent as TwitterSvg } from "../../assets/icons/twitter.svg";
import { ReactComponent as MailSvg } from "../../assets/icons/mail.svg";
import footerItems from "./items";
import {
  Wrapper,
  ContentWrapper,
  Container,
  LeftWrapper,
  List,
  Label,
  ItemsWrapper,
  Item,
  RightWrapper,
  BottomWrapper,
} from "./styled";

// Map for SVG icons
const SvgMap = new Map([
  ["github.svg", GithubSvg],
  ["discord.svg", DiscordSvg],
  ["twitter.svg", TwitterSvg],
  ["mail.svg", MailSvg],
]);

// Main Footer component
const Footer = ({ github }) => {
  return (
    <Wrapper>
      <Container>
        <ContentWrapper>
          <LeftWrapper>
            {footerItems.map((item, index) => (
              <List key={index}>
                <Label>{item.label}</Label>
                <ItemsWrapper>
                  {item.items.map((linkItem, linkIndex) => (
                    <a
                      href={
                        linkItem.key === "github" && github
                          ? github
                          : linkItem.link
                      }
                      key={linkIndex}
                    >
                      <Item>
                        {linkItem.icon && (() => {
                          const SvgTag = SvgMap.get(linkItem.icon);
                          return SvgTag ? <SvgTag /> : null; // Check if SvgTag exists
                        })()}
                        {linkItem.name}
                      </Item>
                    </a>
                  ))}
                </ItemsWrapper>
              </List>
            ))}
          </LeftWrapper>
          <RightWrapper>
            <FooterLogoSvg />
            <div className="support_text">
              Support W/<span>❤️</span> at the 🐻Beraden
            </div>
          </RightWrapper>
        </ContentWrapper>
        <BottomWrapper>
          {`© ${new Date().getFullYear()} BeraVote. All Rights Reserved.`}
        </BottomWrapper>
      </Container>
    </Wrapper>
  );
};

export default Footer;
