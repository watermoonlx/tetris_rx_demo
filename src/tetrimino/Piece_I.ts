import { PieceBase } from './PieceBase';

export class Piece_I extends PieceBase {

    private static shapes = [
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ]
    ];

    constructor(initShapeIndex: number = 0) {
        super(initShapeIndex);
        this.currentShape = Piece_I.shapes[this.currentShapeIndex];
    }

    Rotate() {
        let nextShapeIndex = (this.currentShapeIndex + 1) % 4;
        return new Piece_I(nextShapeIndex);
    }


}