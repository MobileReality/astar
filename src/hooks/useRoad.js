import { useState, useEffect } from 'react';
import {doCalculations, addNextParents} from '../utils/doMoveCalculations';
import { removeUndefined } from '../utils/getUniques';
import { evaluateTilesFromOpen, removeCurrentPositionFromOpen, removeBlockerTilesFromOpen } from "../utils/doMoveCalculations";
import { getPath } from "../utils/calculateDistance";
import groupBy from 'lodash.groupby';

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
    } = doCalculations(currentPlace)
    const [road, setRoad] = useState([currentPlace]);
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
        } = doCalculations(currentPlace)
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
            const uniquesWithoutRoadTiles = evaluateTilesFromOpen(newUniques, road.concat(currentPlace));
            const withoutBlocker = removeBlockerTilesFromOpen(uniquesWithoutRoadTiles, blockers);
            const withoutCurrentPlace = removeCurrentPositionFromOpen(prevState.concat(withoutBlocker), currentPlace);
            return withoutCurrentPlace
        })
    }, [currentPlace.x, currentPlace.y])



    const findLowestCostTile = () => {
        let openWithoutEvaluation = open.filter((item) => item.status === 'waiting');
        if(openWithoutEvaluation.length === 0) {
            openWithoutEvaluation = open.filter((item) => item.status === 'skipped')
        }
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
            move(findLowestCostTile())
            setRoad((prevState) => prevState.concat(findLowestCostTile()))

        }
    }, [count])


    const resolvePath = () => {
        let tempPath = []
        road.reverse().forEach((item) => {
            tempPath = tempPath.concat(item.parents)
        })
        setPath(tempPath.filter(item => !!item));
    }

    const setFinalPath = () => {
        resolvePath();
    }

    return {
        open,
        road,
        path,
        setFinalPath,
    }
}
