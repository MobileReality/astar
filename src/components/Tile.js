import React, { useMemo } from 'react'
import './Tile.css'

export const MemoTile = ({ item, isBlocker, isOpen, isRoad, isGoal, isUserPosition, setTileAsBlocker, isSetting }) => {
    const classes = isBlocker ? 'block_tile' : 'tile';
    const isVisitedClass = isOpen ? 'is_open' : '';
    const isRoadClass = isRoad ? 'is_road' : '';
    const isGoalClass = isGoal ? 'is_goal' : '';
    const isUserPositionClass = isUserPosition ? 'is_user' : '';
    const memoIsRoadClass = useMemo(() => isRoadClass, [isRoadClass]);
    const memoIsGoalClass = useMemo(() => isGoalClass, [isGoalClass]);
    const memoIsVisitedClass = useMemo(() => isVisitedClass, [isVisitedClass]);
    return <div
        onMouseMove={() => {
            if(isSetting) {
                setTileAsBlocker({ x: item.x, y: item.y })
            }
        }}
        className={`size ${classes} ${memoIsVisitedClass} ${memoIsRoadClass} ${memoIsGoalClass} ${isUserPositionClass}`}
    />
};

export const Tile = React.memo(MemoTile);

