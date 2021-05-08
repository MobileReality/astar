import { useState, useEffect } from 'react';
import {doCalculations, evaluateRestTiles} from '../utils/doMoveCalculations';
import { removeUndefined } from '../utils/getUniques';
import { evaluateTilesFromOpen, removeCurrentPositionFromOpen, removeBlockerTilesFromOpen } from "../utils/doMoveCalculations";


export const useRoad = (player, blockers, count, move) => {
    const {
        leftTile,
        rightTile,
        topTile,
        bottomTile,
        topLeftTile,
        topRightTile,
        bottomLeftTile,
        bottomRightTile,
    } = doCalculations(player, [])
    const [road, setRoad] = useState([player]);
    const [path, setPath] = useState([]);
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
        } = doCalculations(player, open)
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
        setOpen((prevState) => {
            const uniquesWithoutRoadTiles = evaluateTilesFromOpen(newUniques, road.concat(player));
            const withoutBlocker = removeBlockerTilesFromOpen(uniquesWithoutRoadTiles, blockers);
            const withoutCurrentPlace = removeCurrentPositionFromOpen(prevState.concat(withoutBlocker), player);
            return withoutCurrentPlace
        })
    }, [player.x, player.y])



    const findLowestCostTile = () => {
        let openWithoutEvaluation = open.filter((item) => item.status === 'waiting');
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
        if(count > 0) {
            const nextTile = findLowestCostTile();
            move(nextTile)
            setRoad((prevState) => prevState.concat(nextTile))
        }
    }, [count])


    const resolvePath = (start) => {
        let tempPath = []
        const getParent = (tile) => {
            if (tile.parent === null) return;
            tempPath.push(tile.parent);
            getParent(tile.parent)
        }
        getParent(start);
        setPath(tempPath);
    }

    const setFinalPath = () => {
        resolvePath(road[road.length - 1]);
    }

    return {
        open,
        road,
        path,
        setFinalPath,
    }
}
