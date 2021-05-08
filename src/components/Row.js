import React from 'react';
import { Tile } from './Tile';
import './Row.css'

const MemoRow = ({ x, columns, blockers, open, road, goal, path, userPosition, setTileAsBlocker, isSetting }) => {
    const columnsToRender = new Array(columns).fill(x);

    const isOpen = (y) => {
        return open.length > 0 && open.find((visitedTile) => visitedTile.y === y);
    }
    const isBlocker = (y) => {
        return blockers.length > 0 && blockers.find((blocker) => blocker.y === y);
    }
    const isRoad = (y) => {
        return road.length > 0 && road.find((roadTile) => roadTile.y === y);
    }
    const isGoal = (y) => {
        return goal && goal.y === y;
    }

    const isPath = (y) => {
        return path.length > 0 && path.find((pathTile) => pathTile.y === y);
    }

    const isUserPosition = (x, y) => {
        return userPosition.x === x && userPosition.y === y;
    }

    return(
        <div className="row">
            {columnsToRender
                .map((item, index) => ({ x: item, y: index, ...item }))
                .map((item, index) => {
                return <Tile
                    key={`${item.x}_${item.y}`}
                    item={item}
                    isBlocker={isBlocker(item.y)}
                    isOpen={isOpen(item.y)}
                    isRoad={isRoad(item.y)}
                    isGoal={isGoal(item.y)}
                    isPath={isPath(item.y)}
                    isUserPosition={isUserPosition(item.x, item.y)}
                    setTileAsBlocker={setTileAsBlocker}
                    isSetting={isSetting}
                />
            })}
        </div>
    )
}

export const Row = React.memo(MemoRow);
