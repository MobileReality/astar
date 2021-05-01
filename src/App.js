import React, {useEffect, useState, useRef} from 'react';
import './App.css';
import { Map } from './components/Map';
import { useBlockers } from './hooks/useBlockers';
import { usePlayer } from './hooks/useUser';
import { useRoad } from './hooks/useRoad';
import { START, GOAL, DIMENSION } from './constants';
import { findLowestCostTile } from './utils/calculateDistance';

function App() {
    const { position, move } = usePlayer(START);
    const { blockers, setBlockersOnMap, setTileAsBlocker } = useBlockers({ dimension: DIMENSION });
    const { open, road, setOpen } = useRoad(position, blockers);
    const [isSetting, setIsSetting] = useState(false);
    const openRef = useRef(open);
    const positionRef = useRef(position)

    useEffect(() => {
        openRef.current = open;
        positionRef.current = position;
    }, [open, position])

    const moveToLowestCost = () => {
        const handler = setInterval(() => {
            if (positionRef.current.x === GOAL.x && positionRef.current.y === GOAL.y) {
                clearInterval(handler);
                return
            }
            move(findLowestCostTile(openRef.current, setOpen))
        }, 20);
    }


    const moveByOneTile = () => move(findLowestCostTile(openRef.current, setOpen))


    console.log(open);

    return (
    <div className="App" onMouseDown={() => setIsSetting(true)} onMouseUp={() => setIsSetting(false)}>
      <header className="App-header">

          <button onClick={moveToLowestCost}>move</button>
          <button onClick={moveByOneTile}>move by one tile</button>
          <button onClick={() => setBlockersOnMap()}>set blockers</button>
          <Map
              columns={DIMENSION}
              rows={DIMENSION}
              blockers={blockers}
              open={open}
              road={road}
              goal={GOAL}
              userPosition={position}
              setTileAsBlocker={setTileAsBlocker}
              isSetting={isSetting}
          />
      </header>
    </div>
  );
}

export default App;
