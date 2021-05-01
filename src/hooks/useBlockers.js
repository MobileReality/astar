import React, { useState } from 'react'
import '../components/Tile.css'

export const useBlockers = ({ dimension }) => {
    const [blockers, setBlockers] = useState([]);

    const calculateBlockers = () => {
        const calculate = () => {
            const coordinate = Math.round(Math.random() * dimension)
            if (coordinate !== 0)
                return coordinate - 1;
            return coordinate
        }
        return new Array(dimension * 6).fill(0).map(() => ({
            x: calculate(),
            y: calculate(),
        }))
            .filter(({ x, y }) => (x !== 0 && y !== 0))
            .filter(({ x, y }) => (x !== dimension - 1 && y !== dimension - 1))
    }

    const setBlockersOnMap = () => {
        setBlockers(calculateBlockers());
    }

    const setTileAsBlocker = (tile) => {
        setBlockers((prevState) => prevState.concat(tile));
    }

    return {
        setBlockersOnMap,
        blockers,
        setTileAsBlocker
    }
}
