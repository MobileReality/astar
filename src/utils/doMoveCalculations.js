import { addCosts, addTentativeCosts } from './calculateDistance';
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
        array = array.map((openTile) => {
            if(openTile.x === roadTile.x && openTile.y === roadTile.y) {
                return {
                    ...openTile,
                    STATUS: 'road',
                }
            }
            return {
                ...openTile,
                STATUS: 'waiting',
            };
        });
    })
    return array;
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

const checkIfAlreadyAddedToOpen = (item, open) => {
    if(!item) return;
    if(open.find((openItem) => openItem.x === item.x && openItem.y === item.y)) {
        return undefined;
    }
    return item
}

export const evaluateRestTiles = (open) => {
    return open.map((item) => {
        if(item.STATUS === 'waiting') {
            return {
                ...item,
                STATUS: 'skipped',
            }
        }
        return item
    })
}


export const doCalculations = (position, open) => {
    const leftTile = addCosts(
        checkIfAlreadyAddedToOpen(
            checkIfCanReturn({ x: letCalculateLowerPosition(position.x), y: position.y }),
            open
        )
    );
    const rightTile = addCosts(
        checkIfAlreadyAddedToOpen(
            checkIfCanReturn({ x: letCalculateHigherPosition(position.x), y: position.y }),
            open,
        )
    );
    const topTile = addCosts(
        checkIfAlreadyAddedToOpen(
            checkIfCanReturn({ x: position.x, y: letCalculateHigherPosition(position.y) }),
            open
        )
    );
    const bottomTile = addCosts(
        checkIfAlreadyAddedToOpen(
            checkIfCanReturn({ x: position.x, y: letCalculateLowerPosition(position.y) }),
            open
        )
    );
    const topLeftTile = addCosts(
        checkIfAlreadyAddedToOpen(
            checkIfCanReturn({ x: letCalculateLowerPosition(position.x), y: letCalculateHigherPosition(position.y) }),
            open
        )
    );
    const topRightTile = addCosts(
        checkIfAlreadyAddedToOpen(
            checkIfCanReturn({ x: letCalculateHigherPosition(position.x), y: letCalculateHigherPosition(position.y) }),
            open
        )
    );
    const bottomLeftTile = addCosts(
        checkIfAlreadyAddedToOpen(
            checkIfCanReturn({ x: letCalculateLowerPosition(position.x), y: letCalculateLowerPosition(position.y) }),
            open
        )
    );
    const bottomRightTile = addCosts(
        checkIfAlreadyAddedToOpen(
            checkIfCanReturn({ x: letCalculateHigherPosition(position.x), y: letCalculateLowerPosition(position.y) }),
            open,
        )
    );
    return {
        leftTile: leftTile && addTentativeCosts(position, leftTile),
        rightTile: rightTile && addTentativeCosts(position, rightTile),
        topTile: topTile && addTentativeCosts(position, topTile),
        bottomTile: bottomTile && addTentativeCosts(position, bottomTile),
        topLeftTile: topLeftTile && addTentativeCosts(position, topLeftTile),
        topRightTile: topRightTile && addTentativeCosts(position, topRightTile),
        bottomLeftTile: bottomLeftTile && addTentativeCosts(position, bottomLeftTile),
        bottomRightTile: bottomRightTile && addTentativeCosts(position, bottomRightTile),
    }
}
