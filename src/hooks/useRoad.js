import { useState, useEffect } from 'react';
import {doCalculations, evaluateRestTiles} from '../utils/doMoveCalculations';
import { GOAL } from '../constants';
import { removeUndefined } from '../utils/getUniques';
import { evaluateTilesFromOpen, removeCurrentPositionFromOpen, removeBlockerTilesFromOpen } from "../utils/doMoveCalculations";


export const useRoad = (player, blockers, count, move) => {
    const [road, setRoad] = useState([player]);
    const [path, setPath] = useState([]);
    // initial tiles
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

    const [neighbours, setCurrentNeighbours] = useState(evaluateTilesFromOpen(uniques, road));
    const [open, setOpen] = useState(evaluateTilesFromOpen(uniques, road));
    const isGoalReached = road[road.length - 1] && road[road.length - 1].x === GOAL.x && road[road.length - 1].y === GOAL.y

    // update area based on new position
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
            neighbours,
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
        const newNeighbours = removeUndefined([
            neighbours.leftTile,
            neighbours.rightTile,
            neighbours.bottomTile,
            neighbours.topTile,
            neighbours.topLeftTile,
            neighbours.topRightTile,
            neighbours.bottomLeftTile,
            neighbours.bottomRightTile,
        ])
        const parseData = (uniques, prevState = []) => {
            const uniquesWithoutRoadTiles = evaluateTilesFromOpen(uniques, road.concat(player));
            const withoutBlocker = removeBlockerTilesFromOpen(uniquesWithoutRoadTiles, blockers);
            const withoutCurrentPlace = removeCurrentPositionFromOpen(prevState.concat(withoutBlocker), player);
            return withoutCurrentPlace
        }
        setCurrentNeighbours(parseData(newNeighbours));
        setOpen((prevState) => parseData(newUniques, prevState))
    }, [player.x, player.y])



    const findLowestCostTile = () => {
        const getMinCost = (data) => {
            const allCosts = data.map((item) => item.cost);
            const min = Math.min(...allCosts);
            return {
                minArray: data.filter((item) => item.cost === min),
                min,
            };
        }
        const getMinHCost = (data) => {
            const hMinCosts = data.map((item) => item.hCost);
            const hMin = Math.min(...hMinCosts);
            const tileToMove = data.find((item) => item.hCost === hMin);
            return tileToMove;
        }
        // evaluating all open tiles
        let openWithoutEvaluation = open.filter((item) => item.status === 'waiting');
        if(openWithoutEvaluation.length === 0) {
            openWithoutEvaluation = open.filter((item) => item.status === 'skipped');
        }
        const { minArray, min } = getMinCost(openWithoutEvaluation);
        const neighboursCosts = getMinCost(neighbours);

        // evaluating only neighbour tiles
        if(neighboursCosts.min < min) {
            if(neighboursCosts.minArray.length > 1) {
                return getMinHCost(neighboursCosts.minArray);
            }
            return neighbours.find((item) => item.cost === neighboursCosts.min);
        }

        if(minArray.length > 1) {
            return getMinHCost(minArray);
        }
        const tileToMove = openWithoutEvaluation.find((item) => item.cost === min);
        return tileToMove;
    }

    useEffect(() => {
        if(count > 0 && !isGoalReached) {
            const nextTile = findLowestCostTile();
            move(nextTile)
            setOpen((prevState) => evaluateRestTiles(prevState))
            setRoad((prevState) => prevState.concat(nextTile))
            setFinalPath()
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
