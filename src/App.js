import React, {useEffect, useState, useRef} from 'react';
import './App.css';
import { Map } from './components/Map';
import { useBlockers } from './hooks/useBlockers';
import { usePlayer } from './hooks/useUser';
import { useRoad } from './hooks/useRoad';
import { START, GOAL, DIMENSION } from './constants';

function App() {
    const [count, setCount] = useState(0);
    const { player, move } = usePlayer(START);
    const { blockers, setBlockersOnMap, setTileAsBlocker } = useBlockers({ dimension: DIMENSION });
    const { open, road, path, setFinalPath } = useRoad(player, blockers, count, move);
    const [isSetting, setIsSetting] = useState(false);
    const positionRef = useRef(player)

    useEffect(() => {
        positionRef.current = player;
    })


    const moveByOneTile = () => setCount((prevState) => prevState + 1);

    const moveToLowestCost = () => {
        const handler = setInterval(() => {
            if (positionRef.current.x === GOAL.x && positionRef.current.y === GOAL.y) {
                clearInterval(handler);
                return
            }
            moveByOneTile()
        }, 5);
    }



    return (
    <div className="App"
         onMouseDown={() => setIsSetting(true)} onMouseUp={() => setIsSetting(false)}
    >
      <header className="App-header">
          <button onClick={moveToLowestCost}>move</button>
          <button onClick={moveByOneTile}>move by one tile</button>
          <button onClick={setBlockersOnMap}>set blockers</button>
          <button onClick={setFinalPath}>set path</button>
          <Map
              columns={DIMENSION}
              rows={DIMENSION}
              blockers={blockers}
              open={open}
              road={road}
              path={path}
              goal={GOAL}
              userPosition={player}
              setTileAsBlocker={setTileAsBlocker}
              isSetting={isSetting}
          />
      </header>
    </div>
  );
}

export default App;
