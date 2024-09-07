import React, { useRef, useState, useEffect } from "react";
import TowerSelectionMenu from "./TowerSelection/TowerSelectionMenu"; 
import TowerDetails from "./TowerDetails/TowerDetails";
import { towerTypes } from "./towers";
import Enemy from "./Enemy";
import { waves } from "./EnemyDetails";
import { enemyTypes } from "./EnemyDetails";
import map from "../imgs/map.png";
import "./GameBoard.css";

const GameBoard = () => {
  const canvasRef = useRef(null);
  const [selectedTower, setSelectedTower] = useState(null);
  const [towers, setTowers] = useState([]);
  const [preview, setPreview] = useState({ x: 0, y: 0, type: null });
  const [towerId, setTowerId] = useState(0);
  const [currentTower, setCurrentTower] = useState(null); 
  const [cursorStyle, setCursorStyle] = useState("default"); 
  const [enemies, setEnemies] = useState([]); 
  const [health, setHealth] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [projectiles, setProjectiles] = useState([]);
  const [currentWave, setCurrentWave] = useState(0);
  const [enemiesRemaining, setEnemiesRemaining] = useState(0);
  const [coins, setCoins] = useState(1000); 
  const [towerImages, setTowerImages] = useState({});
  const [loadingImages, setLoadingImages] = useState(true);

  const path = [
    { x: 0, y: 200 },
    { x: 1000, y: 200 },
    { x: 1000, y: 400 },
    { x: 400, y: 400 },
    { x: 400, y: 700 },
    { x: 800, y: 700 },
    { x: 800, y: 550 },
    { x: 1000, y: 550 },
    { x: 1000, y: 900 },
  ];

  const upgradeTower = () => {
    if (currentTower) {
      const towerIndex = towers.findIndex(
        (tower) => tower.id === currentTower.id
      );
      const tower = towers[towerIndex];
      const towerAttributes = towerTypes[tower.type];

      if (
        tower.upgradeLevel < towerAttributes.upgrades.length &&
        coins >= towerAttributes.upgrades[tower.upgradeLevel].upgradeCost
      ) {
        const upgradedProperties = towerAttributes.upgrades[tower.upgradeLevel];
        const upgradedTower = {
          ...tower,
          ...upgradedProperties, 
          upgradeLevel: tower.upgradeLevel + 1, 
        };

        const newTowers = [...towers];
        newTowers[towerIndex] = upgradedTower;
        setCoins(coins - upgradedProperties.upgradeCost);
        setTowers(newTowers);
        setCurrentTower(upgradedTower); 
      } else {
        alert("Not enough coins to upgrade this tower.");
      }
    }
  };

  const drawProjectile = (ctx, x, y, radius, color) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawProjectiles = (ctx) => {
    projectiles.forEach((projectile) => {
      drawProjectile(ctx, projectile.x, projectile.y, 10, "black");
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const fireProjectiles = () => {
      const newProjectiles = [];
      towers.forEach((tower) => {
        const range = tower.range || 0;
        const damage = tower.damage || 1;
        const rateOfAttack = tower.attackSpeed || 100; 

        const towerX = tower.x + rect.left;
        const towerY = tower.y + rect.top;

        enemies.forEach((enemy) => {
          const dx = enemy.x - towerX;
          const dy = enemy.y - towerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (
            distance <= range &&
            Date.now() - (tower.lastFire || 0) >= rateOfAttack
          ) {
            newProjectiles.push({
              x: towerX - rect.left,
              y: towerY - rect.top,
              damage: damage,
            });
            tower.lastFire = Date.now(); 
          }
        });
      });

      setProjectiles((prevProjectiles) => [
        ...prevProjectiles,
        ...newProjectiles,
      ]);
    };

    const intervalId = setInterval(fireProjectiles, 1); 
    return () => clearInterval(intervalId);
  }, [enemies, towers]); 

  const resetGame = () => {
    setGameOver(false);
    setHealth(1000);
    setEnemies([]);
    setTowers([]);
    setCurrentTower(null);
    setSelectedTower(null);
    setCurrentWave(0);
    setEnemiesRemaining(0);
    setCoins(1000);
    setTowerId(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    if (enemies.length <= 0) {
      setProjectiles([]);
    }
    const moveProjectiles = () => {
      setProjectiles((prevProjectiles) =>
        prevProjectiles
          .map((projectile) => {
            let closestEnemy = null;
            let minDistance = Infinity;

            enemies.forEach((enemy) => {
              const dx = enemy.x - rect.left - projectile.x;
              const dy = enemy.y - rect.top - projectile.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < minDistance) {
                minDistance = distance;
                closestEnemy = enemy;
              }
            });

            if (closestEnemy) {
              const dx = closestEnemy.x - rect.left - projectile.x;
              const dy = closestEnemy.y - rect.top - projectile.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance > 0) {
                const speed = 5; 
                const moveX = (dx / distance) * speed;
                const moveY = ((dy - scrollY) / distance) * speed;

                return {
                  ...projectile,
                  x: projectile.x + moveX,
                  y: projectile.y + moveY,
                };
              }
            }

            return projectile;
          })
          .filter((projectile) => {
            return !enemies.some((enemy) => {
              const dx = enemy.x - rect.left - projectile.x - scrollX;
              const dy = enemy.y - rect.top - projectile.y - scrollY;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < enemy.size / 2 + 10) {
                setEnemies(
                  (prevEnemies) =>
                    prevEnemies
                      .map((e) =>
                        e === enemy
                          ? { ...e, health: e.health - projectile.damage }
                          : e
                      )
                      .filter((e) => e.health > 0) 
                );
                if (enemy.health - projectile.damage <= 0) {
                  setCoins(coins + enemy.coins);
                }

                return true;
              }
              return false;
            });
          })
      );
    };

    requestAnimationFrame(moveProjectiles);
  }, [enemies]);

  const updateEnemyPositions = () => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    setEnemies((prevEnemies) =>
      prevEnemies
        .map((enemy) => {
          const { pathIndex, progress } = enemy;
          const nextIndex = pathIndex + 1;
          const start = path[pathIndex];
          const end = path[nextIndex];

          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const moveDistance = enemy.speed;
          const newProgress = Math.min(progress + moveDistance, distance);

          const scrollX = window.scrollX;
          const scrollY = window.scrollY;

          const newX =
            start.x + (dx * newProgress) / distance + rect.left + scrollX;
          const newY =
            start.y + (dy * newProgress) / distance + rect.top + scrollY;

          return {
            ...enemy,
            x: newX,
            y: newY,
            progress: newProgress,
            pathIndex: newProgress === distance ? nextIndex : pathIndex,
            progress: newProgress === distance ? 0 : newProgress,
          };
        })
        .filter((enemy) => {
          if (enemy.pathIndex === path.length - 1 && enemy.progress === 0) {
            setHealth((prevHealth) => Math.max(prevHealth - enemy.damage, 0)); 
            return false; 
          }
          return true;
        })
    );
    if (health <= 0) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(updateEnemyPositions, 10); 
      return () => clearInterval(intervalId);
    }
  }, [gameOver, health, enemies]);

  useEffect(() => {
    if (health <= 0 && !gameOver) {
      setGameOver(true);
    }
  }, [health, gameOver]);

  const addEnemy = (type) => {
    if (gameOver) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const enemyProperties = enemyTypes[type];

    const x = rect.left;
    const y = rect.top;
    setEnemies((prevEnemies) => [
      ...prevEnemies,
      {
        x: path[0].x,
        y: path[0].y,
        size: enemyProperties.size,
        color: enemyProperties.color,
        damage: enemyProperties.damage,
        health: enemyProperties.health,
        maxHealth: enemyProperties.health,
        speed: enemyProperties.speed,
        pathIndex: 0,
        progress: 0,
        type: type,
        image: enemyProperties.imageSrc,
        coins: enemyProperties.coins,
      },
    ]);
  };

  const isPositionOccupied = (x, y, size) => {
    return towers.some((tower) => {
      const towerSize = towerTypes[tower.type]?.size || 500; 
      return (
        x - size / 2 < tower.x + towerSize / 2 &&
        x + size / 2 > tower.x - towerSize / 2 &&
        y - size / 2 < tower.y + towerSize / 2 &&
        y + size / 2 > tower.y - towerSize / 2
      );
    });
  };

  const isPositionOnPath = (x, y, size) => {
    const towerRect = {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
    };
    const pathWidth = 70;

    for (let i = 0; i < path.length - 1; i++) {
      const segment = { start: path[i], end: path[i + 1] };
      if (isRectIntersectingBufferedLine(towerRect, segment, pathWidth)) {
        return true;
      }
    }
    return false;
  };

  const isRectIntersectingBufferedLine = (rect, line, lineWidth) => {
    const bufferedLine = {
      start: {
        x: line.start.x - lineWidth / 2,
        y: line.start.y - lineWidth / 2,
      },
      end: {
        x: line.end.x + lineWidth / 2,
        y: line.end.y + lineWidth / 2,
      },
    };

    return isRectIntersectingLine(rect, bufferedLine);
  };

  const isRectIntersectingLine = (rect, line) => {
    const rectEdges = [
      {
        start: { x: rect.x, y: rect.y },
        end: { x: rect.x + rect.width, y: rect.y },
      },
      {
        start: { x: rect.x + rect.width, y: rect.y },
        end: { x: rect.x + rect.width, y: rect.y + rect.height },
      },
      {
        start: { x: rect.x + rect.width, y: rect.y + rect.height },
        end: { x: rect.x, y: rect.y + rect.height },
      },
      {
        start: { x: rect.x, y: rect.y + rect.height },
        end: { x: rect.x, y: rect.y },
      },
    ];

    return rectEdges.some((rectEdge) =>
      isLinesIntersecting(rectEdge.start, rectEdge.end, line.start, line.end)
    );
  };

  const isLinesIntersecting = (p1, p2, p3, p4) => {
    const det = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (det === 0) return false; 

    const t =
      ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / det;
    const u =
      -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / det;

    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  };

  const drawTowers = (ctx) => {
    const backgroundImage = new Image();
    backgroundImage.src = map;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
    ctx.drawImage(backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);

    drawPath(ctx); 

    towers.forEach((tower) => {
      const towerAttributes = towerTypes[tower.type] || {};
      const size = towerAttributes.size;
      const imageIndex = tower.upgradeLevel;
      const images = towerImages[tower.type] || {};
      const image = images[imageIndex];

      if (image) {
        ctx.drawImage(
          image,
          tower.x - size / 2,
          tower.y - size / 2 - 20,
          size,
          size + 20
        );
      } else {
        ctx.fillStyle = towerAttributes.color;
        ctx.fillRect(tower.x - size / 2, tower.y - size / 2, size, size);
      }
    });
  };

  const drawPath = (ctx) => {
    ctx.strokeStyle = "transparent"; 
    ctx.lineWidth = 75; 
    ctx.lineCap = "round"; 
    ctx.lineJoin = "round"; 

    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    path.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  };

  const drawPreview = (ctx) => {
    if (selectedTower && preview.type) {
      const towerAttributes = towerTypes[preview.type] || {};
      const size = towerAttributes.size;
      const range = towerAttributes.range || 0;

      ctx.fillStyle = towerAttributes.color;
      ctx.globalAlpha = 0.5; 
      ctx.fillRect(preview.x - size / 2, preview.y - size / 2, size, size);
      ctx.globalAlpha = 1.0; 

      ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"; 
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(preview.x, preview.y, range, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawCurrentTowerRange = (ctx) => {
    if (currentTower) {
      const towerAttributes = towerTypes[currentTower.type] || {};
      const size = towerAttributes.size || 50;
      const range = currentTower.range || 0;

      ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"; 
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(currentTower.x, currentTower.y, range, 0, Math.PI * 2);
      ctx.stroke();
    }
  };
  useEffect(() => {
    const loadImages = async () => {
      const towerImages = {};
      const towerTypesList = Object.keys(towerTypes);

      for (const type of towerTypesList) {
        const tower = towerTypes[type];
        const images = [tower.img, ...tower.upgrades.map((u) => u.img)];

        const loadedImages = {};
        for (const [index, imgSrc] of images.entries()) {
          const image = new Image();
          image.src = imgSrc; 
          await new Promise((resolve) => {
            image.onload = resolve;
          });
          loadedImages[index] = image;
        }
        towerImages[type] = loadedImages;
      }

      setTowerImages(towerImages);
      setLoadingImages(false);
    };

    loadImages();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      drawTowers(ctx); 
      drawPreview(ctx);
      drawCurrentTowerRange(ctx); 
      drawProjectiles(ctx);
    }
  }, [towers, preview, currentTower, projectiles, enemies]);

  const handleCanvasClick = (e) => {
    if (gameOver) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedTower = towers.find((tower) => {
      const size = towerTypes[tower.type]?.size || 50;
      return (
        x >= tower.x - size / 2 &&
        x <= tower.x + size / 2 &&
        y >= tower.y - size / 2 &&
        y <= tower.y + size / 2
      );
    });

    if (clickedTower) {
      setCurrentTower(clickedTower);
    } else if (selectedTower) {
      const towerAttributes = towerTypes[selectedTower] || {};
      const size = towerAttributes.size;
      const cost = towerAttributes.cost;

      if (coins >= cost) {
        if (!isPositionOccupied(x, y, size) && !isPositionOnPath(x, y, size)) {
          const newTower = {
            id: towerId,
            x: x,
            y: y,
            type: selectedTower,
            range: towerAttributes.range,
            damage: towerAttributes.damage,
            attackSpeed: towerAttributes.attackSpeed,
            upgradeLevel: 0,
          };
          setCoins(coins - cost); 
          setTowers([...towers, newTower]);
          setTowerId(towerId + 1); 
          setSelectedTower(null); 
          setPreview({ x: 0, y: 0, type: null }); 
        } else {
          alert(
            "Cannot place tower here. Tower overlaps with an existing one or the path."
          );
        }
      } else {
        alert("Not enough coins to place this tower.");
        setPreview({ x: 0, y: 0, type: null });
        setSelectedTower(null); 
      }
    } else {
      setCurrentTower(null);
      return;
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const towerAttributes = towerTypes[preview.type] || {};
    const size = towerAttributes.size || 50;

    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;


    setPreview({ x, y, type: selectedTower });

    const overTower = towers.some((tower) => {
      const size = towerTypes[tower.type]?.size || 50;
      return (
        x >= tower.x - size / 2 &&
        x <= tower.x + size / 2 &&
        y >= tower.y - size / 2 &&
        y <= tower.y + size / 2
      );
    });

    setCursorStyle(overTower ? "pointer" : "default"); 
  };

  const deleteTower = () => {
    if (currentTower) {
      setTowers(towers.filter((tower) => tower.id !== currentTower.id));
      setCurrentTower(null); 
    }
  };

  const spawnWave = () => {
    if (currentWave >= waves.length) return; 

    console.log("current wave is " + currentWave);
    let totalEnemies = 0;

    const waveCopy = JSON.parse(JSON.stringify(waves[currentWave]));

    waveCopy.forEach((group) => {
      totalEnemies += group.count;
    });

    setEnemiesRemaining(totalEnemies);
    console.log(waveCopy);
    console.log("total enemies: " + totalEnemies);

    const intervalId = setInterval(() => {
      if (waveCopy.length === 0) {
        clearInterval(intervalId);
        return;
      }

      const currentGroup = waveCopy[0];
      if (currentGroup.count > 0) {
        addEnemy(currentGroup.type);
        currentGroup.count--;
      } else {
        waveCopy.shift(); 
      }
    }, 500);

    setCurrentWave(currentWave + 1); 
  };

  return (
    <div>
      <button className="button" onClick={spawnWave}>
        {currentWave === 0 ? "Spawn First Wave" : "Spawn Next Wave"}
      </button>
      <div className="spawn_buttons">
        <h2>Spawn Extra Enemies</h2>
        <button className="button" onClick={() => addEnemy("basic")}>
          add basic{" "}
        </button>
        <button className="button" onClick={() => addEnemy("fast")}>
          add fast{" "}
        </button>
        <button className="button" onClick={() => addEnemy("tank")}>
          add tank{" "}
        </button>
      </div>
      <TowerSelectionMenu onSelectTower={setSelectedTower} />
      <div className="canvas_Wrapper">
        <canvas
          ref={canvasRef}
          width={1200}
          height={900}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          style={{
            border: "1px solid #000",
            cursor: cursorStyle,
          }}
        />{" "}
        <div className="game_information">
          {" "}
          <p>
            Health: <span className="health">{health}</span>
          </p>
          <p>
            Wave: <span>{currentWave}</span>
          </p>
          <p>
            Coins: <span className="coins">{coins}</span>
          </p>
        </div>
        <TowerDetails
          tower={currentTower}
          deleteTower={deleteTower}
          upgradeTower={upgradeTower}
        />
      </div>
      {enemies.map((enemy, index) => (
        <Enemy
          key={index}
          x={enemy.x - enemy.size / 2}
          y={enemy.y - enemy.size / 2}
          size={enemy.size}
          color={enemy.color}
          type={enemy.type}
          health={enemy.health}
          maxHealth={enemy.maxHealth}
          image={enemy.image}
        />
      ))}{" "}
      {gameOver ? (
        <>
          <div className="gameover_overlay">
            <div className="gameover_box">
              <div className="gameover_title">Game Over</div>
              <button className="gameover_button" onClick={resetGame}>
                Try Again
              </button>
            </div>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default GameBoard;
