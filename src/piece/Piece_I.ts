import { PieceBase } from './PieceBase';
import { PieceType } from './PieceType';
import { MainWindow } from '../ui/MainWindow';
import { Coordinate } from '../common/Coordinate';

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
        super(initShapeIndex, PieceType.I);
        this.currentShape = Piece_I.shapes[this.currentShapeIndex];
        let initialX = Math.floor(MainWindow.size.width / 2) - 2;
        switch (initShapeIndex) {
            case 0: this.position = new Coordinate(initialX, 3); break;
            case 1: this.position = new Coordinate(initialX, 1); break;
            case 2: this.position = new Coordinate(initialX, 2); break;
            case 3: this.position = new Coordinate(initialX, 1); break;
        }
    }
}