import styled from 'styled-components';
import { Panel } from 'rsuite';

export const ImageContainer = styled.div`
  width: 240px;
  height: 240px;
  outline: 2px black solid;
  overflow: hidden;
`

export const AllAnswerContainer = styled.div`
  margin: 20px auto;
  background-color:#fff;
  display:grid;
  grid-template-columns: 200px 200px;
  grid-template-rows: 200px 200px 200px 200px 200px 200px;
  grid-row: auto auto;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`

export const AnswerBox = styled.div`
  background-color:${props => !props.selected ? props.colour : '#333'};
  padding:20px;
  border-radius:10px;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:40px;
  font-family:sans-serif;
  cursor: pointer;
`

export const RegPanel = styled(Panel)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  text-align: center;

`
