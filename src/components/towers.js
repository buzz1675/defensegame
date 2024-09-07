import Tower1_1 from "../imgs/Tower 1.png";
import Tower1_2 from "../imgs/Tower 2.png";
import Tower1_3 from "../imgs/tower 3.png";
import Tower2_1 from "../imgs/Tower 2 (1).png";
import Tower2_2 from "../imgs/Tower 2 (2).png";
import Tower2_3 from "../imgs/Tower 2 (3).png";
import Tower3_1 from "../imgs/Tower 3 (1).png";
import Tower3_2 from "../imgs/Tower 3 (2).png";
import Tower3_3 from "../imgs/Tower 3 (3).png";


export const towerTypes = {
  Basic: {
    color: "red",
    damage: 10,
    attackSpeed: 250,
    range: 100,
    size: 60,
    cost: 100,
    img: Tower1_1,
    upgrades: [
      {
        range: 120,
        damage: 15,
        attackSpeed: 150,
        upgradeCost: 100,
        img: Tower1_2,
      },
      {
        range: 250,
        damage: 20,
        attackSpeed: 100,
        upgradeCost: 200,
        img: Tower1_3,
      },
    ],
  },
  Quick: {
    color: "blue",
    damage: 5,
    attackSpeed: 125,
    range: 120,
    size: 50,
    cost: 100,
    img: Tower2_1,

    upgrades: [
      {
        range: 140,
        damage: 7,
        attackSpeed: 100,
        upgradeCost: 100,
        img: Tower2_2,
      },
      {
        range: 160,
        damage: 8,
        attackSpeed: 75,
        upgradeCost: 200,
        img: Tower2_3,
      },
    ],
  },
  Heavy: {
    color: "green",
    damage: 50,
    attackSpeed: 450,
    range: 80,
    size: 55,
    cost: 100,
    img: Tower3_1,

    upgrades: [
      {
        range: 120,
        damage: 75,
        attackSpeed: 375,
        upgradeCost: 100,
        img: Tower3_2,
      },
      {
        range: 170,
        damage: 100,
        attackSpeed: 325,
        upgradeCost: 200,
        img: Tower3_3,
      },
    ],
  },
  
};
