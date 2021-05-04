import { useState, useEffect } from 'react';
import { doCalculations } from '../utils/doMoveCalculations';
import { removeUndefined } from '../utils/getUniques';
import { evaluateTilesFromOpen, removeCurrentPositionFromOpen, removeBlockerTilesFromOpen, evaluateRestTiles } from "../utils/doMoveCalculations";
import {findLowestCostTile} from "../utils/calculateDistance";

export const useRoad = (currentPlace, blockers, count, move) => {
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


    const findLowestCostTile = () => {
        const openWithoutEvaluation = open.filter((item) => item.STATUS !== 'road');
        const openAllCosts = openWithoutEvaluation.map((item) => item.cost);

        const min = Math.min(...openAllCosts);
        const arrayOfMins = openWithoutEvaluation.filter((item) => item.cost === min);

        if(arrayOfMins.length > 1) {
            const openHMinCosts = arrayOfMins.map((item) => item.hCost);
            const hMin = Math.min(...openHMinCosts);
            const tileToMove = openWithoutEvaluation.find((item) => item.hCost === hMin);
            return tileToMove;
        }
        const tileToMove = openWithoutEvaluation.find((item) => item.cost === min);
        return tileToMove;
    }

    useEffect(() => {
        move(findLowestCostTile())
    }, [count])



    return {
        open,
        road,
        setOpen
    }
}
