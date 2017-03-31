import { Piece_I } from './Piece_I';
import { Piece_J } from './Piece_J';
import { PieceType } from './PieceType';
import { PieceBase } from './PieceBase';

let PieceMap: Map<PieceType, Function> = new Map<PieceType, Function>();

PieceMap.set(PieceType.I, Piece_I);
PieceMap.set(PieceType.J, Piece_J);

export { Piece_I, Piece_J, PieceMap, PieceBase };