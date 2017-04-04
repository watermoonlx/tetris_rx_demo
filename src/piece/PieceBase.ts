import { PieceType } from './PieceType';
import { Color } from '../common/Color';
import { Coordinate } from '../common/Coordinate';
import { MainWindow } from '../ui/MainWindow';

export class PieceBase {
    type: PieceType;
    shapes: number[][][];
    currentShapeIndex: number;
    currentShape: number[][];
    position: Coordinate;
    color: Color;
    continue: boolean;
}