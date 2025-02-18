import styled from 'styled-components';

const Wrapper = styled.footer`
  flex: 0 0 auto;
  background: var(--background);
  .support_text {
    font-size: 18px;
    text-align: end;
    padding: 10px;
    color: var(--neutral-3);
    font-weight: 400;
    margin-top: 55px;
    width: 400px;
    > span {
      color: red !important;
    }
  }
`;

const ContentWrapper = styled.div`
  padding: 80px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  @media screen and (max-width: 1200px) {
    padding: 80px 32px;
  }
  @media screen and (max-width: 900px) {
    padding: 40px 20px 20px;
    flex-direction: column;
    > :not(:first-child) {
      margin-top: 40px;
    }
  }
`;

const Container = styled.div`
  max-width: 1080px;
  margin: 0 auto;
`;

const LeftWrapper = styled.div`
  display: grid;
  row-gap: 32px;
  column-gap: 40px;
  grid-template-columns: repeat(4, 1fr);
  @media screen and (max-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 360px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const List = styled.div`
  width: 160px;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 24px;
  color: var(--white)
`;

const ItemsWrapper = styled.div`
  > :not(:first-child) > * {
    margin-top: 16px;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.65);
  > svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  &:hover {
    color: rgb(255, 255, 255);
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  svg {
    width: 230px !important;
    height: 60px !important;
  }

  > div {
    text-align: right;
    font-size: 16px;
    line-height: 24px;
    color: rgba(255, 255, 255, 0.35);
  }
  @media screen and (max-width: 900px) {
    align-items: flex-start;
    > img {
      margin-bottom: 0;
    }
    > div {
      text-align: left;
    }
  }
`;

const BottomWrapper = styled.div`
  font-size: 14px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.35);
  padding-bottom: 20px;
  text-align: center;
`;

// Export all styled components
export {
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
};
