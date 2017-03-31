import "babel-polyfill";
import * as Rx from 'rxjs';
import { GenerateRandomPiece, Move } from './piece/PieceActions';
import { Action } from './common/ConstValue';
import { PieceBase } from './piece/Pieces';
import { MainWindow, InsertPieceToWin } from './ui/MainWindow';
import { Keyboard } from './common/Keyboard';

const rootTick$ = Rx.Observable
    .interval(100)
    .share();

const tick$ = rootTick$
    .throttleTime(1000);

const currentPiece$ = new Rx.Subject<PieceBase>().startWith(GenerateRandomPiece());
const backgroudWindow$ = new Rx.Subject<MainWindow>().startWith(new MainWindow());

const userAction$ = Rx.Observable.fromEvent(document, 'keydown')
    .filter((i: KeyboardEvent) => Keyboard.arrowSet.has(i.key))
    .map((i: KeyboardEvent) => {
        let action: string;
        switch (i.key) {
            case Keyboard.arrowUp: action = Action.Rotate; break;
            case Keyboard.arrowDown: action = Action.Down; break;
            case Keyboard.arrowLeft: action = Action.Left; break;
            case Keyboard.arrowRight: action = Action.Right; break;
            default: break;
        }
        return action;
    })
    .startWith(Action.Rotate);

const movingPiece$ = Rx.Observable.combineLatest(currentPiece$, tick$, userAction$)
    .combineLatest(backgroudWindow$)
    .map(i => {
        return {
            piece: i[0][0],
            tick: i[0][1],
            action: i[0][2],
            backgroudWin: i[1]
        }
    })
    .scan((prev, cur) => {
        let newPiece: PieceBase;
        if (prev.tick !== cur.tick) {
            newPiece = Move('down')(prev.piece, cur.backgroudWin);
        }
        else {
            switch (cur.action) {
                case Action.Down: newPiece = Move('down')(prev.piece, cur.backgroudWin); break;
                case Action.Left: newPiece = Move('left')(prev.piece, cur.backgroudWin); break;
                case Action.Right: newPiece = Move('right')(prev.piece, cur.backgroudWin); break;
                case Action.Rotate: break;
            }
        }
        return {
            piece: newPiece,
            tick: cur.tick,
            action: cur.action,
            backgroudWin: cur.backgroudWin
        };
    })
    .map(i => i.piece);


const displayWindow$ = movingPiece$.combineLatest(backgroudWindow$)
    .map(i => {
        let curPiece = i[0];
        let curBackgroudWin = i[1];
        InsertPieceToWin(curPiece, curBackgroudWin)
    });



// movingPiece$.subscribe((i) => {
//     for (let y = 0; y < i.currentShape.length; y++) {
//         let s = i.currentShape[y].join(' ');
//         console.log(s);
//     }
//     console.log(`当前位置(x:${i.position.x},y:${i.position.y})`);
//     console.log('');
// });

backgroudWindow$.subscribe(i => {
    console.log('===========================================')
    for (let y = 4; y < MainWindow.size.height - 1; y++) {
        let s = i.currentGrid[y].slice(1, MainWindow.size.width - 1).join(' ');
        console.log(`line ${y}: ${s}`);
    }
})

