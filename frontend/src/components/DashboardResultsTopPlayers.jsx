import React from 'react'
import {
  List,
  FlexboxGrid
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import PropTypes from 'prop-types';

export default function DashboardResultsTopPlayers ({ playersData }) {
  return (
  <List bordered>
    {playersData.map((item, idx) => (
      <List.Item key={idx}>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item>
            <h4><b>{idx + 1}.</b> {item.name}</h4>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <h4>{item.score} points</h4>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </List.Item>
    ))}
  </List>
  )
}
DashboardResultsTopPlayers.propTypes = {
  playersData: PropTypes.array,
}
