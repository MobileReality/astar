import React from 'react';
import {Row} from "./Row";
import './Map.css';

export const Map = ({ columns, rows, blockers, open, road, goal, userPosition, setTileAsBlocker, isSetting }) => {
    const rowsToRender = new Array(rows).fill(0);

    const getRowValue = (tiles, index) => {
        return tiles.filter((tile) => tile.x === index)
    }



    return(
        <div className="map">
            {rowsToRender.map(
                (undefined, index) => {
                    return(
                         <Row
                             key={index}
                             x={index}
                             columns={columns}
                             blockers={getRowValue(blockers, index)}
                             open={getRowValue(open, index)}
                             road={getRowValue(road, index)}
                             goal={goal.x === index && goal}
                             userPosition={userPosition}
                             setTileAsBlocker={setTileAsBlocker}
                             isSetting={isSetting}
                         />
                    )
                }
                ).reverse()
            }
        </div>
    )
}
