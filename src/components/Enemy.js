// Enemy.js

import enemyImage from "../imgs/6_walking.png";
import example from "../imgs/example.png";

import React, { useRef } from "react";
import { enemyTypes } from "./EnemyDetails";

const Enemy = ({ x, y, size, color, health, maxHealth, type, frame = 18 }) => {
  const canvasRef = useRef(null);

  const enemyAttributes = enemyTypes[type];
  const { imageSrc, spriteWidth, spriteHeight, framesPerRow } = enemyAttributes;

  const healthBarWidth = size;
  const healthBarHeight = 5;
  const healthPercentage = (health / maxHealth) * 100;
  const style = {
    position: "absolute",
    left: x, 
    top: y, 
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius: "50%", 
    pointerEvents: "none", 
  };

 

  return (
    <>
    <img src={imageSrc} style={{
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
        
          transform: `translate(50%, 50%)`, 
        }}/>
    
      <div
        style={{
          position: "absolute",
          left: x,
          top: y - 10, 
          width: healthBarWidth,
          height: healthBarHeight,
          backgroundColor: "red",
        }}
      >
        <div
          style={{
            width: `${healthPercentage}%`,
            height: "100%",
            backgroundColor: "green",
          }}
        ></div>
      </div>
    </>
  );
};

export default Enemy;
