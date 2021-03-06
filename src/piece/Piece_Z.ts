import { PieceBase } from './PieceBase';
import { PieceType } from './PieceType';
import { MainWindow } from '../ui/MainWindow';
import { Coordinate } from '../common/Coordinate';
import { Piece } from './Piece.decorator';

let shapes = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ]
];

@Piece({
    type: PieceType.Z,
    shapes: shapes
})
export class Piece_Z extends PieceBase {
    constructor(initShapeIndex: number = 0) {
        super();
        let initialX = Math.floor(MainWindow.size.width / 2) - 2;
        switch (initShapeIndex) {
            case 0: this.position = new Coordinate(initialX, 2); break;
            case 1: this.position = new Coordinate(initialX, 1); break;
            case 2: this.position = new Coordinate(initialX, 1); break;
            case 3: this.position = new Coordinate(initialX, 1); break;
        }
    }
}