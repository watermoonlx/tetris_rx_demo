import { PieceBase } from './PieceBase';
import { PieceType } from './PieceType';
import { MainWindow } from '../ui/MainWindow';
import { Coordinate } from '../common/Coordinate';

export class Piece_J extends PieceBase {
    private static shapes = [
        [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 1, 1],
            [0, 1, 0],
            [0, 1, 0]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 1]
        ],
        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ]
    ];

    constructor(initShapeIndex: number = 0) {
        super(initShapeIndex, PieceType.J);
        this.currentShape = Piece_J.shapes[this.currentShapeIndex];
        let initialX = Math.floor(MainWindow.size.width / 2) - 2;
        switch (initShapeIndex) {
            case 0: this.position = new Coordinate(initialX, 3); break;
            case 1: this.position = new Coordinate(initialX, 2); break;
            case 2: this.position = new Coordinate(initialX, 2); break;
            case 3: this.position = new Coordinate(initialX, 2); break;
        }
    }
}