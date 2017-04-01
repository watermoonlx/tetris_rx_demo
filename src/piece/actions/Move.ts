import { PieceBase } from '../PieceBase';
import { PieceMap } from '../Pieces';
import { MainWindow } from '../../ui/MainWindow';

function clonePiece(piece: PieceBase): PieceBase {
    let constructor: any = PieceMap.get(piece.type);
    let instance = new constructor(piece.currentShapeIndex) as PieceBase;
    instance.position.x = piece.position.x;
    instance.position.y = piece.position.y;
    return instance;
}

function checkMoveValid(piece: PieceBase, win: MainWindow) {
    let isValid = true;
    for (let deltaY = 0; deltaY < piece.currentShape.length; deltaY++) {
        let y = piece.position.y + deltaY;
        for (let deltaX = 0; deltaX < piece.currentShape[deltaY].length; deltaX++) {
            let x = piece.position.x + deltaX;
            if (piece.currentShape[deltaY][deltaX] == 1 && win.currentGrid[y][x] == 1) {
                isValid = false;
                break;
            }
        }
        if (!isValid) {
            break;
        }
    }
    return isValid;
}


function Move(dir: 'down'): (piece: PieceBase, backgroudWin: MainWindow) => PieceBase;
function Move(dir: 'left'): (piece: PieceBase, backgroudWin: MainWindow) => PieceBase;
function Move(dir: 'right'): (piece: PieceBase, backgroudWin: MainWindow) => PieceBase;
function Move(dir: 'down' | 'left' | 'right') {
    return function (piece: PieceBase, win: MainWindow) {
        let cloned = clonePiece(piece);
        switch (dir) {
            case 'down':
                cloned.position.y += 1;
                break;
            case 'left':
                cloned.position.x -= 1;
                break;
            case 'right':
                cloned.position.x += 1;
                break;
            default: break;
        }
        if (checkMoveValid(cloned, win))
            return cloned;
        else {
            if (dir == 'down') {
                cloned.continue = false;
                return cloned;
            } else {
                return clonePiece(piece);
            }
        }
    }
}

export { Move };