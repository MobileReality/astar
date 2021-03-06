import { useState, useEffect } from 'react';
import { letCalculateLowerPosition, letCalculateHigherPosition } from '../utils/evaluateCalculations';

export const usePlayer = (startingPoint) => {
    const extendUserData = {
        gCost: 0,
        parent: null,
    }
    const [player, setPosition] = useState({
        ...startingPoint,
        ...extendUserData,
    });

    useEffect(() => {
        setPosition((prevValue) => ({
            ...prevValue,
            x: startingPoint.x,
            y: startingPoint.y,
        }))
    }, [startingPoint.x, startingPoint.y])

    function setListenToArrows() {
        document.addEventListener('keyup', function(event) {
            const up = 'ArrowUp';
            const down = 'ArrowDown';
            const left = 'ArrowLeft';
            const right = 'ArrowRight';
            switch (event.code) {
                case up: {
                    setPosition((prevValue) => {
                        return {
                            ...prevValue,
                            x: letCalculateHigherPosition(prevValue),
                        }
                    });
                    break;
                }
                case down: {
                    setPosition((prevValue) => {
                        return {
                            ...prevValue,
                            x: letCalculateLowerPosition(prevValue),
                        }
                    });
                    break;
                }
                case left: {
                    setPosition((prevValue) => {
                        return {
                            ...prevValue,
                            y: letCalculateLowerPosition(prevValue),
                        }
                    });
                    break;
                }
                case right: {
                    setPosition((prevValue) => {
                        return {
                            ...prevValue,
                            y: letCalculateHigherPosition(prevValue)
                        }
                    });
                    break;
                }
                default: {
                    break;
                }
            }
        })
    }

    const move = (position) => {
        setPosition(position);
    }

    useEffect(() => {
        setListenToArrows();
    }, [])

    return {
        player,
        setPosition,
        move,
        extendUserData,
    }
}
