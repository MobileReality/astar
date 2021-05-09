import React, {useEffect, useState, useRef} from 'react';
import './App.css';
import { Map } from './components/Map';
import { useBlockers } from './hooks/useBlockers';
import { usePlayer } from './hooks/useUser';
import { useRoad } from './hooks/useRoad';
import { START, GOAL, DIMENSION } from './constants';

function App() {
    const [count, setCount] = useState(0); // frames

    const [ withSkipping, setWithSkipping ] = useState(true);
    const [ withNeighbourEvaluation, setWithNeighbourEvaluation ] = useState(true);

    const { player, move } = usePlayer(START);
    const {
        blockers,
        setBlockersOnMap,
        setTileAsBlocker,
        setBlockersBasedOnGeneratedMap,
    } = useBlockers({ dimension: DIMENSION });
    const {
        open,
        road,
        path,
        setFinalPath,
        isGoalReached
    } = useRoad(
        player,
        blockers,
        count,
        move,
        withSkipping,
        withNeighbourEvaluation
    );
    const [isSetting, setIsSetting] = useState(false);
    const positionRef = useRef(player)

    // updating position based on frame (count)
    /* eslint-disable */
    useEffect(() => {
        positionRef.current = player;
        setFinalPath()
    }, [count])
    /* eslint-enable */

    const moveByOneTile = () => setCount((prevState) => prevState + 1);

    const moveToLowestCost = () => {
        const handler = setInterval(() => {
            if (isGoalReached(positionRef.current)) {
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
          <div className="buttons">
              <button onClick={moveToLowestCost}>move</button>
              <button onClick={setBlockersOnMap}>set blockers</button>
              <button onClick={setBlockersBasedOnGeneratedMap}>set blockers based on map</button>
              <button
                  className={withSkipping ? 'with-condition' : ''}
                  onClick={() => setWithSkipping((prevState) => !prevState)}
              >
                  with skipping
              </button>
              <button
                  className={withNeighbourEvaluation ? 'with-condition' : ''}
                  onClick={() => setWithNeighbourEvaluation((prevState) => !prevState)}
              >
                  with neighbours evaluation
              </button>
          </div>
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
