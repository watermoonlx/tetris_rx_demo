import { TetriminoType } from '../common/TetriminoType';
import { Color } from '../common/Color';
import { Coordinate } from '../common/Coordinate';

export class PieceBase {
    type: PieceBase;
    currentShapeIndex: number;
    currentShape: number[][];
    center: Coordinate;
    color: Color;

    constructor(initShapeIndex: number = 0) {
        this.currentShapeIndex = initShapeIndex;
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

    paint(): void {
        throw new Error('paint() need to be implement by child class');
    }
}