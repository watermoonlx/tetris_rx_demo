import { PieceBase } from '../PieceBase';
import { PieceMap } from '../Pieces';
import { MainWindow } from '../../ui/MainWindow';

function clonePiece(piece: PieceBase): PieceBase {
    let constructor: any = PieceMap.get(piece.type);
    let instance = new constructor(piece.currentShapeIndex) as PieceBase;
    instance.continue = piece.continue;
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

function Rotate(piece: PieceBase, backgroudWin: MainWindow) {
    let cloned = clonePiece(piece);
    let nextShapeIndex = (piece.currentShapeIndex + 1) % 4;
    cloned.currentShapeIndex = nextShapeIndex;
    cloned.currentShape = cloned.shapes[cloned.currentShapeIndex];
    let isValid = true;
    for (let i = 0; i < 4; i++) {
        isValid = checkRotateValid(cloned, backgroudWin);
        if (isValid)
            break;
    }
    if (isValid)
        return cloned;
    else
        return clonePiece(piece);
}

function checkRotateValid(piece: PieceBase, backgroudWin: MainWindow) {
    let needMoveX = 0;
    let needMoveY = 0;
    let middleIndex = Math.floor((piece.shapes[0][0].length - 1) / 2);
    let moveToRight = true;
    for (let deltaY = 0; deltaY < piece.currentShape.length; deltaY++) {
        let needMoveFlag = false;
        let y = piece.position.y + deltaY;
        for (let deltaX = 0; deltaX < piece.currentShape[deltaY].length; deltaX++) {
            let x = piece.position.x + deltaX;
            if (piece.currentShape[deltaY][deltaX] == 1 && backgroudWin.currentGrid[y][x] == 1) {
                needMoveX += 1;
                needMoveFlag = true;
                if (x <= middleIndex)
                    moveToRight = true;
                else
                    moveToRight = false;
            }
        }
        if (needMoveFlag)
            needMoveY += 1;
    }
    if (needMoveX == 0 && needMoveY == 0) {
        return true;
    } else {
        if (piece.currentShapeIndex == 0 || piece.currentShapeIndex == 1) {
            if (moveToRight)
                piece.position.x += needMoveX;
            else
                piece.position.x -= needMoveX;
        }
        else {
            piece.position.y -= needMoveY;
        }
        return false;
    }
}

export { Move, Rotate };