import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 15, 15, 0.3);
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px,
    rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px;
  border-radius: 6px;
  background: white;
  margin: auto auto;
  top: 90px;
  overflow: hidden;
  width: 75%;
  min-height: 80vh;
  max-height: 80vh;
  max-width: 700px;

  & > div:first-child {
    display: flex;
    align-items: center;
    border: none;
    padding: 0px 16px;
    width: 100%;
    background: transparent;
    font-size: 18px;
    line-height: inherit;
    height: 48px;
    flex-grow: 0;
    flex-shrink: 0;
    z-index: 1;
    box-shadow: rgba(55, 53, 47, 0.09) 0px 1px 0px;

    & > input {
      font-size: inherit;
      line-height: inherit;
      border: none;
      background: none;
      width: 100%;
      display: block;
      resize: none;
      padding: 0px;
      min-width: 0px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const SmallText = styled.div`
  display: ${({ state }) => (state ? 'flex' : 'none')};
  padding-right: 14px;
  margin-top: 12px;
  margin-bottom: 10px;
  color: rgba(55, 53, 47, 0.65);
  fill: rgba(55, 53, 47, 0.45);
  font-size: 12px;
  font-weight: 600;
  line-height: 120%;
  user-select: none;
  margin-left: 2px;
`;

const ResultContainer = styled.div`
  display: ${({ state }) => state && 'none'};
  padding: 0 14px;
  margin-top: 5px;
`;

const ResultBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  padding: 10px;
  transition: none 0s ease 0s;
  cursor: pointer;
  width: calc(100% - 8px);
  margin-right: 4px;
  border-radius: 3px;
  padding-left: 4px;
  :hover {
    cursor: pointer;
    background-color: rgb(220, 220, 220);
  }
`;

const BottomBox = styled.div`
  display: flex;
  position: absolute;
  top: 705px;
  align-items: center;
  line-height: 120%;
  width: 100%;
  user-select: none;
  min-height: 28px;
  font-size: 12px;
  color: rgba(55, 53, 47, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & > div:first-child {
    margin-left: 12px;
    margin-right: 12px;
    min-width: 0px;
    flex: 1 1 auto;

    & > ul {
      display: flex;

      & > li > span:last-child {
        margin-right: 10px;
      }
    }
  }
`;

const S = {
  Wrapper,
  Container,
  SmallText,
  ResultContainer,
  ResultBox,
  BottomBox,
};

export default S;
