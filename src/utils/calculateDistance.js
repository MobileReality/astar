import { START, GOAL } from '../constants';

const gCost = (tilePosition, playerPosition) => { // gCost from start
    const width = tilePosition.x - playerPosition.x;
    const height = tilePosition.y - playerPosition.y;
    return Number(Math.sqrt(width*width + height*height).toFixed(1))
}

const hCost = (tilePosition) => { // hCost from end
    const width = GOAL.x - tilePosition.x;
    const height = GOAL.y - tilePosition.y;
    return Number(Math.sqrt(width*width + height*height).toFixed(1))
}

const tCost = (source, currentPosition) => {
    const neighbourWidth = currentPosition.x - source.x;
    const neighbourHeight = currentPosition.y - source.y;
    const t_cost = Number(Math.sqrt(neighbourWidth*neighbourWidth + neighbourHeight*neighbourHeight).toFixed(1));
    const cost = t_cost + gCost(source);
    return Number(cost.toFixed(1));
}

export const addCosts = (item, player = undefined) => {
    if(!item) return undefined;
    const g_cost = gCost(item, player) + player.gCost;
    const h_cost = hCost(item);
    const cost = g_cost + h_cost;
    const itemToReturn = {
        x: item.x,
        y: item.y,
        gCost: g_cost,
        hCost: h_cost,
        cost: Number(cost.toFixed(1)),
        parent: player,
    }
    return itemToReturn
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

