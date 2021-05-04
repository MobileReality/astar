import { START, GOAL } from '../constants';

const gCost = (currentPosition) => { // gCost from start
    const width = currentPosition.x - START.x;
    const height = currentPosition.y - START.y;
    return Number(Math.sqrt(width*width + height*height).toFixed(1))
}

const hCost = (currentPosition) => { // hCost from end
    const width = GOAL.x - currentPosition.x;
    const height = GOAL.y - currentPosition.y;
    return Number(Math.sqrt(width*width + height*height).toFixed(1))
}

const tCost = (source, currentPosition) => {
    const neighbourWidth = currentPosition.x - source.x;
    const neighbourHeight = currentPosition.y - source.y;
    const t_cost = Number(Math.sqrt(neighbourWidth*neighbourWidth + neighbourHeight*neighbourHeight).toFixed(1));
    const cost = t_cost + gCost(source);
    return Number(cost.toFixed(1));
}

export const addCosts = (item, position = undefined) => {
    if(!item) return undefined;
    const g_cost = gCost(item);
    const h_cost = hCost(item);
    const tentativeCost = position && tCost(position, item);
    const cost = g_cost + h_cost
    return {
        x: item.x,
        y: item.y,
        gCost: g_cost,
        hCost: h_cost,
        tCost: tentativeCost,
        cost: Number(cost.toFixed(1)),
        parents: [addCosts(position)],
    }
}

//   parentKey: JSON.stringify({ x: source.x, y: source.y }),
export const addTentativeCosts = (source, item) => {
    const tentativeCost = tCost(source, item);
    if(tentativeCost < item.gCost) {
        return {
            ...item,
            gCost: tentativeCost,
            cost: item.hCost + tentativeCost,
            source: { x: source.x, y: source.y },
            tCost: tentativeCost,
            IS_TENTATIVE_BETTER: true,
        }
    }
    return {
        ...item,
        source: { x: source.x, y: source.y },
        tCost: tentativeCost,
    }
}

export const getPath = (open) => {
    return open.filter((item) => !!item.source).map((item) => item.source)
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

