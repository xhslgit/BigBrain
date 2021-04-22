import styled, { createGlobalStyle } from 'styled-components';

import {
  Panel,
  Button,
  FlexboxGrid,
  Modal
} from 'rsuite';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    // background-color: #03F7EB;
    background-color: #f6f6f6;
  }
`;

export const ImageContainer = styled.div`
  width: 240px;
  height: 240px;
  outline: 2px black solid;
  overflow: hidden;
`

export const AllAnswerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  column-gap: 10px;
  row-gap: 25px;
`

export const AnswerBox = styled.div`
  flex-basis: 40%;
  width: 200px;
  height: 200px;
  background-color:${props => !props.selected ? props.colour : '#333'};
  padding:20px;
  border-radius:10px;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:30px;
  font-family:sans-serif;
  cursor: pointer;
`

export const RegPanel = styled(Panel)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30%;
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: white;
  @media screen and (max-width: 800px) {
    width: 80%;
  }
`

export const MainPageContainer = styled.div`
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  // background-color: #03F7EB;
  background-color: #f6f6f6;
`

const DashboardButton = styled(Button)`
  position: fixed; 
  border-radius: 25px; 
  font-size: 20px;
  z-index: 100;
`

export const NewGameButton = styled(DashboardButton)`
  bottom: 30px;
  right: 30px;
`
export const JoinGameButton = styled(DashboardButton)`
  top: 10px;
  left: 10px;
  @media screen and (max-width: 675px) {
    top: unset;
    bottom: 30px;
  }
`

export const LogoutButton = styled(DashboardButton)`
  top: 60px;
  left: 10px;
  @media screen and (max-width: 675px) {
    top: unset;
    left: 150px;
    bottom: 30px;
  }
`
export const QuizCardGrid = styled(FlexboxGrid)`
  column-gap: 50px;
  row-gap: 50px;
  margin: auto;
  margin-top: 30px;
  max-width: 60%;
  @media screen and (max-width: 675px) {
    margin-bottom: 100px;
  }
`

export const QuizCardPanel = styled(Panel)`
  display: inline-block;
  width: 240px;
  background-color: white;
`

export const OptionsMenu = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  column-gap: 5px;
  row-gap: 5px;
  margin-top: 5px;
`

export const QuizEditPanel = styled(Panel)`
  width: 40%;
  margin: 5em auto;
  text-align: center;
  background-color: white;
  & > h2, h3, h4 {
    color: black;
  }
  @media screen and (max-width: 1400px) {
    width: 80%;
  }
`
export const QuestionEditPanel = styled(Panel)`
  width: 60%;
  margin: 5em auto;
  @media screen and (max-width: 1200px) {
    width: 80%;
  }
`
export const GamePagePanel = styled(Panel)`
  width: 90%;
  margin: 5em auto;
  text-align: center;
  & > h1, h2, h3, h4 {
    color: black;
  }
`

export const GameResultsPanel = styled(Panel)`
  margin: 5em auto;
  width: 90%;
  text-align: center;
`

export const ModalStyle = styled(Modal)`
  text-align: center;
  @media screen and (max-width: 675px) {
    width: 80%;
  }
`
