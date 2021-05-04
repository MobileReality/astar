import { addCosts } from './calculateDistance';
import {DIMENSION} from "../constants";

export const letCalculateLowerPosition = (coordinate) => {
    if(coordinate <= 0) {
        return -1
    }
    return coordinate - 1;
}

export const letCalculateHigherPosition = (coordinate) => {
    if(coordinate >= DIMENSION - 1) {
        return -1
    }
    return coordinate + 1;
}

export const removeNegativeValues = (array) => {
    return array.filter((item) => item.x >= 0 && item.y >= 0);
}

export const evaluateTilesFromOpen = (open, road) => {
    let array = open;
    road.forEach((roadTile) => {
        array = array.filter((openTile) => {
            return openTile.x !== roadTile.x || openTile.y !== roadTile.y
        });
    })
    return array.map((item) => ({...item, status: 'waiting'}));
}

export const removeBlockerTilesFromOpen = (open, blockers) => {
    let array = open;
    blockers.forEach((blockerTile) => {
        array = array.filter((openTile) => {
            return openTile.x !== blockerTile.x || openTile.y !== blockerTile.y
        });
    })
    return array;
}

export const removeCurrentPositionFromOpen = (open, currentPosition) => {
    return open.filter((openTile) => openTile.x !== currentPosition.x || openTile.y !== currentPosition.y);
}


const checkIfCanReturn = (item) => {
    if(item.x === -1 || item.y === -1) {
        return undefined;
    }
    return item
}

export const addNextParents = (newOpens, open) => {
    return open.map((openItem) => {
        let openToReturn = openItem;
        newOpens.forEach((newOpenItem) => {
            if(openItem.x === newOpenItem.x && openItem.y === newOpenItem.y) {
                openToReturn = {
                    ...openItem,
                    parents: openItem.parents.concat(newOpenItem.parents) || [],
                }
            }
        })
        return openToReturn;
    })
}

export const evaluateRestTiles = (open) => {
    return open.map((item) => {
        if(item.status === 'waiting') {
            return {
                ...item,
                status: 'skipped',
            }
        }
        return item
    })
}


export const doCalculations = (position) => {
    const leftTile = addCosts(
            checkIfCanReturn({ x: letCalculateLowerPosition(position.x), y: position.y }),
            position
    );
    const rightTile = addCosts(
            checkIfCanReturn({ x: letCalculateHigherPosition(position.x), y: position.y }),
            position
    );
    const topTile = addCosts(
            checkIfCanReturn({ x: position.x, y: letCalculateHigherPosition(position.y) }),
        position
    );
    const bottomTile = addCosts(
            checkIfCanReturn({ x: position.x, y: letCalculateLowerPosition(position.y) }),
        position
    );
    const topLeftTile = addCosts(
            checkIfCanReturn({ x: letCalculateLowerPosition(position.x), y: letCalculateHigherPosition(position.y) }),
        position
    );
    const topRightTile = addCosts(
            checkIfCanReturn({ x: letCalculateHigherPosition(position.x), y: letCalculateHigherPosition(position.y) }),
        position
    );
    const bottomLeftTile = addCosts(
            checkIfCanReturn({ x: letCalculateLowerPosition(position.x), y: letCalculateLowerPosition(position.y) }),
        position
    );
    const bottomRightTile = addCosts(
            checkIfCanReturn({ x: letCalculateHigherPosition(position.x), y: letCalculateLowerPosition(position.y) }),
        position
    );
    return {
        leftTile: leftTile && leftTile,
        rightTile: rightTile && rightTile,
        topTile: topTile && topTile,
        bottomTile: bottomTile && bottomTile,
        topLeftTile: topLeftTile && topLeftTile,
        topRightTile: topRightTile && topRightTile,
        bottomLeftTile: bottomLeftTile && bottomLeftTile,
        bottomRightTile: bottomRightTile && bottomRightTile,
    }
}
