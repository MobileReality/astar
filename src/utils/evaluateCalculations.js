import { addCosts } from './calculateDistance';
import { DIMENSION } from "../constants";

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

const checkIfAlreadyAddedToOpen = (item, open) => {
    if(!item) return;
    if(open.find((openItem) => openItem.x === item.x && openItem.y === item.y)) {
        return undefined;
    }
    return item
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

export const removeUndefined = (array) => {
    return array.filter((item) => item);
}



export const doCalculations = (player, open, goal) => {
    const check = (tile) => checkIfAlreadyAddedToOpen(tile, open)
    const leftTile = addCosts(
        checkIfCanReturn({ x: letCalculateLowerPosition(player.x), y: player.y }),
        goal,
        player
    )
    const rightTile = addCosts(
        checkIfCanReturn({ x: letCalculateHigherPosition(player.x), y: player.y }),
        goal,
        player
    );
    const topTile = addCosts(
        checkIfCanReturn({ x: player.x, y: letCalculateHigherPosition(player.y) }),
        goal,
        player
    );
    const bottomTile = addCosts(
        checkIfCanReturn({ x: player.x, y: letCalculateLowerPosition(player.y) }),
        goal,
        player
    );
    const topLeftTile = addCosts(
        checkIfCanReturn({ x: letCalculateLowerPosition(player.x), y: letCalculateHigherPosition(player.y) }),
        goal,
        player
    );
    const topRightTile = addCosts(
        checkIfCanReturn({ x: letCalculateHigherPosition(player.x), y: letCalculateHigherPosition(player.y) }),
        goal,
        player
    );
    const bottomLeftTile = addCosts(
        checkIfCanReturn({ x: letCalculateLowerPosition(player.x), y: letCalculateLowerPosition(player.y) }),
        goal,
        player
    );
    const bottomRightTile = addCosts(
        checkIfCanReturn({ x: letCalculateHigherPosition(player.x), y: letCalculateLowerPosition(player.y) }),
        goal,
        player
    );
    return {
        leftTile: leftTile && check(leftTile),
        rightTile: rightTile && check(rightTile),
        topTile: topTile && check(topTile),
        bottomTile: bottomTile && check(bottomTile),
        topLeftTile: topLeftTile && check(topLeftTile),
        topRightTile: topRightTile && check(topRightTile),
        bottomLeftTile: bottomLeftTile && check(bottomLeftTile),
        bottomRightTile: bottomRightTile && check(bottomRightTile),
        neighbours: {
            leftTile,
            rightTile,
            topTile,
            bottomTile,
            topLeftTile,
            topRightTile,
            bottomLeftTile,
            bottomRightTile,
        }
    }
}
