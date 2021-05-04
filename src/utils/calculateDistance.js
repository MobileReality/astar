import { START, GOAL } from '../constants';

const gCost = (currentPosition) => { // gCost from start
    const width = currentPosition.x - START.x;
    const height = currentPosition.y - START.y;
    return Math.sqrt(width*width + height*height);
}

const hCost = (currentPosition) => { // hCost from end
    const width = GOAL.x - currentPosition.x;
    const height = GOAL.y - currentPosition.y;
    return Math.sqrt(width*width + height*height);
}

const tCost = (source, currentPosition) => {
    const neighbourWidth = currentPosition.x - source.x;
    const neighbourHeight = currentPosition.y - source.y;
    const t_cost = Math.sqrt(neighbourWidth*neighbourWidth + neighbourHeight*neighbourHeight);
    return t_cost + gCost(source);
}

export const addCosts = (item) => {
    if(!item) return undefined;
    return {
        x: item.x,
        y: item.y,
        gCost: gCost(item),
        hCost: hCost(item),
        cost: gCost(item) + hCost(item),
    }
}


export const addTentativeCosts = (source, item) => {
    const tentativeCost = tCost(source, item);
    if(tentativeCost < item.gCost) {
        return {
            ...item,
            gCost: tentativeCost,
            cost: item.hCost + tentativeCost,
            source: { x: source.x, y: source.y },
            tCost: tentativeCost,
        }
    }
    return {
        ...item,
        source: { x: source.x, y: source.y },
        tCost: tentativeCost,
    }
}

/*
const openWithoutEvaluation = open.filter((item) => item.STATUS !== 'road');
const openOnlyWaiting = openWithoutEvaluation.filter((item) => item.STATUS === 'waiting');
const openGCosts = openOnlyWaiting.map((item) => item.gCost);
const openTCosts = openOnlyWaiting.map((item) => item.tCost);
const minG = Math.min(...openGCosts);
const minT = Math.min(...openTCosts);
if(minT < minG) {
    setOpen(evaluateRestTiles(open))
    const tileToMove = openWithoutEvaluation.find((item) => item.tCost === minT);
    return tileToMove
}
setOpen(evaluateRestTiles(open))

const tileToMove = openWithoutEvaluation.find((item) => item.gCost === minG);
return tileToMove

 */

