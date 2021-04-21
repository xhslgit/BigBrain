import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import PropTypes from 'prop-types';

export default function QuestionBarGraph ({ data }) {
  const nPlayers = data[0].totalPlayers;

  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <XAxis dataKey='question'/>
      <YAxis type="number" domain={[0, nPlayers]} />
      <Tooltip />
      <Legend />
      <Bar dataKey="numCorrect" fill='#8884d8' />
    </BarChart>
  );
}

QuestionBarGraph.propTypes = {
  data: PropTypes.array,
};
