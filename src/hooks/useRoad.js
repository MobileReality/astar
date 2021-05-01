import { useState, useEffect } from 'react';
import { doCalculations } from '../utils/doMoveCalculations';
import { removeUndefined } from '../utils/getUniques';
import { evaluateTilesFromOpen, removeCurrentPositionFromOpen, removeBlockerTilesFromOpen, evaluateRestTiles } from "../utils/doMoveCalculations";

export const useRoad = (currentPlace, blockers) => {
    const {
        leftTile,
        rightTile,
        topTile,
        bottomTile,
        topLeftTile,
        topRightTile,
        bottomLeftTile,
        bottomRightTile,
    } = doCalculations(currentPlace, [])
    const [road, setRoad] = useState([currentPlace]);

    const uniques = removeUndefined([
        leftTile,
        rightTile,
        topTile,
        bottomTile,
        topLeftTile,
        topRightTile,
        bottomLeftTile,
        bottomRightTile,
    ]);
    const [open, setOpen] = useState(evaluateTilesFromOpen(uniques, road));

    useEffect(() => {
        const {
            leftTile,
            rightTile,
            topTile,
            bottomTile,
            topLeftTile,
            topRightTile,
            bottomLeftTile,
            bottomRightTile,
        } = doCalculations(currentPlace, open)
        const newUniques = removeUndefined([
            leftTile,
            rightTile,
            topTile,
            bottomTile,
            topLeftTile,
            topRightTile,
            bottomLeftTile,
            bottomRightTile,
        ])
        setRoad((prevState) => prevState.concat(currentPlace))
        setOpen((prevState) => {
            const uniquesWithoutRoadTiles = evaluateTilesFromOpen(newUniques, road);
            const withoutBlocker = removeBlockerTilesFromOpen(uniquesWithoutRoadTiles, blockers);
            return removeCurrentPositionFromOpen(prevState.concat(withoutBlocker), currentPlace);
        })
    }, [currentPlace.x, currentPlace.y])



    return {
        open,
        road,
        setOpen
    }
}
