import { PieceMap } from '../Pieces';
import { PieceBase } from '../PieceBase';

let pieceArray = Array.from(PieceMap.values());
export function GenerateRandomPiece(): PieceBase {
    let curPiece: any = pieceArray[Math.floor(Math.random() * pieceArray.length)];
    let initDirection = Math.floor(Math.random() * 4);
    return new curPiece(initDirection) as PieceBase;
}