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

const currentPiece$ = Rx.Observable.of(GenerateRandomPiece());


const keyDown$ = Rx.Observable.fromEvent(document, 'keydown')
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
    .startWith('Action.Rotate');

let movingPiece$: Rx.Observable<PieceBase>;
let gameWindow$: Rx.Observable<MainWindow>;

movingPiece$ = Rx.Observable.combineLatest(currentPiece$, tick$, keyDown$, gameWindow$)
    .map(i => {
        return {
            piece: i[0],
            tick: i[1],
            action: i[2],
            gameWin: i[3]
        }
    })
    .scan((prev, cur) => {
        let newPiece: PieceBase;
        let win: MainWindow = prev.gameWin;
        if (prev.tick !== cur.tick) {
            newPiece = Move('down')(prev.piece);
        }
        else {
            switch (cur.action) {
                case Action.Down: newPiece = Move('down')(prev.piece); break;
                case Action.Left: newPiece = Move('left')(prev.piece); break;
                case Action.Right: newPiece = Move('right')(prev.piece); break;
                case Action.Rotate: break;
            }
        }
        return {
            piece: newPiece,
            tick: cur.tick,
            action: cur.action,
            gameWin: win
        };
    })
    .map(i => i.piece);


gameWindow$ = Rx.Observable.combineLatest(movingPiece$, Rx.Observable.of(new MainWindow()), Rx.Observable.of(new MainWindow()))
    .map(i => {
        return {
            piece: i[0],
            window: i[1],
            CombinedWindow: i[2]
        }
    })
    .scan((prev, cur) => {
        let prevWin = prev.window;
        let curPiece = cur.piece;
        let newWin = InsertPieceToWin(curPiece, prevWin);
        return {
            piece: curPiece,
            window: prev.window,
            CombinedWindow: newWin
        };
    })
    .map(i => i.CombinedWindow);



// movingPiece$.subscribe((i) => {
//     for (let y = 0; y < i.currentShape.length; y++) {
//         let s = i.currentShape[y].join(' ');
//         console.log(s);
//     }
//     console.log(`当前位置(x:${i.position.x},y:${i.position.y})`);
//     console.log('');
// });

gameWindow$.subscribe(i => {
    console.log('===========================================')
    for (let y = 4; y < MainWindow.size.height - 1; y++) {
        let s = i.currentGrid[y].slice(1, MainWindow.size.width - 1).join(' ');
        console.log(`line ${y}: ${s}`);
    }
})

