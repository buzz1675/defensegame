import React from 'react';
import { towerTypes } from '../towers';
import './TowerSelectionMenu.css'; 


const TowerSelectionMenu = ({ onSelectTower }) => {
  return (
    <div className="tower_menu">
      <h1>Buy Towers</h1>
        {Object.keys(towerTypes).map((towerKey) => {
        const tower = towerTypes[towerKey];
        return (
          <button className='tower_button'key={towerKey} onClick={() => onSelectTower(towerKey)}>
            {towerKey} ({tower.cost} Coins)
          </button>
        );
      })}
      
    </div>
  );
};

export default TowerSelectionMenu;
