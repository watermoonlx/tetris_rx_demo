import { PieceType } from './PieceType';
import { Color } from '../common/Color';
import { Coordinate } from '../common/Coordinate';
import { MainWindow } from '../ui/MainWindow';

export class PieceBase {
    type: PieceType;
    currentShapeIndex: number;
    currentShape: number[][];
    position: Coordinate;
    color: Color;

    constructor(initShapeIndex: number = 0,pieceType:PieceType) {
        this.currentShapeIndex = initShapeIndex;
        this.type = pieceType;
    }
}