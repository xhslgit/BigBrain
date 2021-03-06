import React, { Fragment, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useToken from '../utils/useToken';
import QuestionBarGraph from '../components/QuestionBarGraph';
import { Button } from 'rsuite';
import { GlobalStyle, GameResultsPanel } from '../style';
import DashboardResultsTopPlayers from '../components/DashboardResultsTopPlayers';

export default function DashboardResultsPage () {
  const SessionId = useParams().SessionId;
  const token = useToken().token;
  const history = useHistory();
  const getFinalResults = (token, id) => {
    return fetch(new URL(`admin/session/${id}/results`, 'http://localhost:5005/'), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    }).then((data) => {
      return data.json();
    })
  }
  const [playersData, setPlayersData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  useEffect(() => {
    getFinalResults(token, SessionId).then((data) => {
      const playerDataArr = [];
      const questionDataArr = [];
      // cycles player
      for (const player of data.results) {
        let playerCorrect = 0;
        let questionIdx = 1;
        // cycles questions
        for (const answer of player.answers) {
          const questionWr = {
            question: questionIdx,
            totalPlayers: data.results.length,
            numCorrect: 0,
          }
          // if array is 0 or if the array doesnt contain q with same id just push
          if (questionDataArr.length < 1 || !questionDataArr.some(e => e.question === questionIdx)) {
            questionDataArr.push(questionWr);
          }
          if (answer.correct) {
            for (const q of questionDataArr) {
              if (q.question === questionIdx) {
                q.numCorrect += 1;
              }
            }
            playerCorrect++;
          }
          questionIdx++;
        }

        const playerInfo = {
          name: player.name,
          score: playerCorrect,
        }

        playerDataArr.push(playerInfo);
      }

      for (const q of questionDataArr) {
        q.question = 'question ' + q.question;
      }
      playerDataArr.sort((a, b) => b.score - a.score);
      setPlayersData(playerDataArr);
      setQuestionData(questionDataArr);
    })
  }, [])
  return (
    <Fragment>
      <GlobalStyle />
      <GameResultsPanel shaded bordered>
        <h1>Here are your results for session {SessionId}!</h1>
        <h2>Top 5 players!</h2>
        <br></br>
        <DashboardResultsTopPlayers
          playersData={playersData}
        />
        <h2>See each questions results!</h2>
        <div style={{ width: '500px', margin: 'auto' }}>
          {questionData.length !== 0 ? <QuestionBarGraph data={questionData} /> : 'loading graph'}
        </div>
        <Button appearance='ghost' color='green' onClick={() => history.push('/dashboard')}>Back to Dashboard</Button>
      </GameResultsPanel>
    </Fragment>
  )
}
