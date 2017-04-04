import { Piece_I } from './Piece_I';
import { Piece_J } from './Piece_J';
import { Piece_L } from './Piece_L';
import { Piece_O } from './Piece_o';
import { Piece_S } from './Piece_S';
import { Piece_T } from './Piece_T';
import { Piece_Z } from './Piece_Z';
import { PieceType } from './PieceType';
import { PieceBase } from './PieceBase';

let PieceMap: Map<PieceType, Function> = new Map<PieceType, Function>();

PieceMap.set(PieceType.I, Piece_I);
PieceMap.set(PieceType.J, Piece_J);
PieceMap.set(PieceType.L, Piece_L);
PieceMap.set(PieceType.O, Piece_O);
PieceMap.set(PieceType.S, Piece_S);
PieceMap.set(PieceType.T, Piece_T);
PieceMap.set(PieceType.Z, Piece_Z);

export { PieceMap, PieceBase };