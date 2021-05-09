import { GOAL } from '../constants';

const gCost = (tilePosition, playerPosition) => { // gCost from start
    const width = tilePosition.x - playerPosition.x;
    const height = tilePosition.y - playerPosition.y;
    return Math.sqrt(width*width + height*height);
}

const hCost = (tilePosition) => { // hCost from end
    const width = GOAL.x - tilePosition.x;
    const height = GOAL.y - tilePosition.y;
    return Math.sqrt(width*width + height*height);
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
        cost: cost,
        parent: player,
    }
    return itemToReturn
}
export const getMinCostTiles = (data) => {
    const allCosts = data.map((item) => item.cost);
    const min = Math.min(...allCosts);
    return {
        minArray: data.filter((item) => item.cost === min),
        min,
    };
}

export const getMinHCostTile = (data) => {
    const hMinCosts = data.map((item) => item.hCost);
    const hMin = Math.min(...hMinCosts);
    const tileToMove = data.find((item) => item.hCost === hMin);
    return tileToMove;
}

export const getMinCostTile = (tiles, min) => tiles.find((item) => item.cost === min);