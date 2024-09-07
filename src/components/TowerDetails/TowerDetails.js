// TowerDetails.js
import React from "react";
import { towerTypes } from "../towers";
import "./TowerDetails.css";

const TowerDetails = ({ tower, deleteTower, upgradeTower }) => {
  if (!tower) {
    return <div className="tower_details">No tower selected</div>;
  }

  const { id, type, x, y, upgradeLevel, range, damage, attackSpeed } = tower;
  const towerAttributes = towerTypes[type] || {};
  const nextUpgrade = towerAttributes.upgrades[tower.upgradeLevel];
  const upgradeCost = nextUpgrade ? nextUpgrade.upgradeCost : 0;

  return (
    <div className="tower_details">
      <h2>Tower Details</h2>
      <p>ID: {id}</p>
      <p>Type: {type}</p>
      <p>Damage: {damage}</p>
      <p>Attack Speed: {attackSpeed}</p>
      <p>Tower Level: {upgradeLevel}</p>
      <p>Range: {range}</p> 
      <button className="delete_button" onClick={deleteTower}>
        Delete Tower
      </button>
      {nextUpgrade && (
        <button className="upgrade_button" onClick={upgradeTower}>
          Upgrade: {upgradeCost} Coins
        </button>
      )}
    </div>
  );
};

export default TowerDetails;
