import React, {useEffect, useState, useRef} from 'react';
import './App.css';
import { Map } from './components/Map';
import { useBlockers } from './hooks/useBlockers';
import { usePlayer } from './hooks/useUser';
import { useRoad } from './hooks/useRoad';
import { useGoalAndStart } from './hooks/useGoalAndStart';
import { DIMENSION } from './constants';

function App() {
    const [count, setCount] = useState(0); // frames

    const [ withSkipping, setWithSkipping ] = useState(true);
    const [ withNeighbourEvaluation, setWithNeighbourEvaluation ] = useState(true);

    const { start, goal, setStart, setGoal, isStartSetting, isGoalSetting, setIsGoalSetting, setIsStartSetting } = useGoalAndStart();
    const { player, move, extendUserData } = usePlayer(start);
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
        isGoalReached,
        clearAll
    } = useRoad(
        goal,
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

    const onSetStart = (position) => {
        clearAll({...position, ...extendUserData});
        setStart(position)
        setIsStartSetting(false)
    }
    const onSetGoal = (position) => {
        setGoal(position)
        setIsGoalSetting(false);
    }

    const editStartPosition = () => {
        setIsStartSetting(true);
        setIsSetting(false);
        setIsGoalSetting(false);
    }

    const editGoalPosition = () => {
        setIsStartSetting(false);
        setIsSetting(false);
        setIsGoalSetting(true);
    }


    return (
    <div className="App">
        <header className="App-header">
            <div className="move-button">
                <button onClick={moveToLowestCost}>move</button>
            </div>
            <div className="App-content">
                <div className="buttons">
                    <div className="setting_buttons">
                        <button onClick={() => window.location.reload()}>reload</button>
                    </div>
                    <div className="setting_buttons">
                        <button disabled={isStartSetting} onClick={editStartPosition}>set start</button>
                        <button disabled={isGoalSetting} onClick={editGoalPosition}>set goal</button>
                    </div>
                    <button onClick={setBlockersOnMap}>set blockers</button>
                    <button onClick={() => setIsSetting(true)}>set blockers individually</button>
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
                    goal={goal}
                    userPosition={player}
                    setTileAsBlocker={setTileAsBlocker}
                    isSetting={isSetting}
                    isStartSetting={isStartSetting}
                    isGoalSetting={isGoalSetting}
                    onSetStart={onSetStart}
                    onSetGoal={onSetGoal}
                />
                <div className="buttons">
                    maps
                    <button onClick={() => setBlockersBasedOnGeneratedMap('wall')}>wall</button>
                    <button onClick={() => setBlockersBasedOnGeneratedMap('mrmap')}>MR map</button>
                    <button onClick={() => setBlockersBasedOnGeneratedMap('something')}>labyrinth</button>
                </div>
            </div>
      </header>
    </div>
  );
}

export default App;
