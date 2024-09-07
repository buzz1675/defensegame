
import monster1 from '../imgs/6_walking.png'
import monster2 from'../imgs/10_walking.png'
import monster3 from '../imgs/montser7_walking.png'
export const enemyTypes = {
  basic: {
    color: "red",
    size: 65,
    speed: 1,
    health: 100,
    damage: 100,
    maxHealth: 100,
    coins: 10,
    imageSrc: monster1,
    spriteWidth: 56,  
    spriteHeight: 38, 
    framesPerRow: 18, 
  },
  fast: {
    color: "blue",
    size: 65,
    speed: 2,
    health: 150,
    damage: 150,
    maxHealth: 10,
    coins: 15,
    imageSrc: monster2,
    spriteWidth: 56,  
    spriteHeight: 38, 
    framesPerRow: 18, 
  },
  tank: {
    color: "orange",
    size: 95,
    speed: 0.5,
    health: 500,
    damage: 400,
    maxHealth: 500,
    coins: 20,
    imageSrc: monster3,
    spriteWidth: 56,  
    spriteHeight: 38, 
    framesPerRow: 18, 
  },
};

export const waves = [
  [
    { count: 5, type: "basic" },
    { count: 2, type: "fast" },
  ],
  [
    { count: 10, type: "basic" },
    { count: 5, type: "tank" },
  ],
  [
    { count: 15, type: "basic" },
    { count: 3, type: "fast" },
    { count: 2, type: "tank" },
  ],
  [
    { count: 20, type: "basic" },
    { count: 8, type: "fast" },
    { count: 4, type: "tank" },
  ],
  [
    { count: 25, type: "basic" },
    { count: 10, type: "fast" },
    { count: 5, type: "tank" },
  ],
];
