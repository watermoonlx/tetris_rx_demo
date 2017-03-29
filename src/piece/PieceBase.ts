import { PieceType } from '../common/PieceType';
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
        this.position=new Coordinate()
    }

    Rotate(): PieceBase {
        throw new Error('Rotate() need to be implement by child class');
    }

    fallDown(): PieceBase {
        throw new Error('fallDown() need to be implement by child class');
    }

    move(direction: 'left' | 'right'): PieceBase {
        throw new Error('fallDown() need to be implement by child class');
    }
}