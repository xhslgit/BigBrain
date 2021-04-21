import styled, { createGlobalStyle } from 'styled-components';

import {
  Panel,
  Button,
  FlexboxGrid
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
  transform: translate(-50%, -50%);
  width: 25%;
  text-align: center;
  background-color: white;
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
`

export const NewGameButton = styled(DashboardButton)`
  bottom: 30px;
  right: 30px;
`
export const JoinGameButton = styled(DashboardButton)`
  top: 10px;
  left: 10px;
`

export const LogoutButton = styled(DashboardButton)`
  top: 60px;
  left: 10px;
`
export const QuizCardGrid = styled(FlexboxGrid)`
  column-gap: 50px;
  row-gap: 50px;
  margin: auto;
  margin-top: 30px;
  max-width: 60%;
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
  margin: auto;
  margin-top: 5em;
  text-align: center;
  background-color: white;
  & > h2, h3, h4 {
    color: black;
  }
`
export const QuestionEditPanel = styled(Panel)`
  width: 50%;
  margin: 5em auto;
`
export const GamePagePanel = styled(Panel)`
  width: 50%;
  margin: 5em auto;
  text-align: center;
  & > h1, h2, h3, h4 {
    color: black;
  }
`

export const GameResultsPanel = styled(Panel)`
  margin: 5em auto;
  width: 50%;
  text-align: center;
`
