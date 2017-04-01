import "babel-polyfill";
import * as Rx from 'rxjs';
import { GenerateRandomPiece, Move } from './piece/PieceActions';
import { Action } from './common/ConstValue';
import { PieceBase } from './piece/Pieces';
import { MainWindow, InsertPieceToWin, calculateMainWindow, checkGameOver, cloneMainWindow } from './ui/MainWindow';
import { Keyboard } from './common/Keyboard';

const rootTick$ = Rx.Observable
    .interval(100)
    .share();

const tick$ = rootTick$
    .throttleTime(1000);

const currentPiece$ = new Rx.Subject<PieceBase>();
const backgroudWindow$ = new Rx.Subject<MainWindow>();

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

const movingPiece$ = Rx.Observable.combineLatest(tick$, userAction$)
    .withLatestFrom(backgroudWindow$, currentPiece$, (i, j, k) => {
        return {
            piece: k,
            backgroudWin: j,
            tick: i[0],
            action: i[1]
        }
    })
    .scan((prev, cur) => {
        let newPiece: PieceBase;
        if (prev.tick !== cur.tick) {
            if (prev.piece.continue)
                newPiece = Move('down')(prev.piece, cur.backgroudWin);
            else
                newPiece = Move('down')(cur.piece, cur.backgroudWin);
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


const displayWindow$ = movingPiece$.withLatestFrom(backgroudWindow$)
    .map(i => {
        let piece = i[0];
        let backgroudWin = i[1];
        let displayWin: MainWindow = null;
        if (piece.continue) {
            displayWin = InsertPieceToWin(piece, backgroudWin);
        }
        return {
            piece: piece,
            backgroudWin: backgroudWin,
            displayWin: displayWin
        }
    })
    .scan((prev, cur) => {
        let nextBackgroudWin: MainWindow;
        let nextDisplayWin: MainWindow;
        let nextPiece: PieceBase;

        if (cur.piece.continue) {
            nextBackgroudWin = cur.backgroudWin;
            nextDisplayWin = cur.displayWin;
            nextPiece = cur.piece;
        } else {
            nextDisplayWin = calculateMainWindow(prev.displayWin);
            if (checkGameOver(nextDisplayWin)) {
                nextDisplayWin = new MainWindow();
                nextBackgroudWin = new MainWindow();
            } else {
                nextBackgroudWin = cloneMainWindow(nextDisplayWin);
            }

            debugger;

            nextPiece = GenerateRandomPiece();
            currentPiece$.next(nextPiece);
            backgroudWindow$.next(nextBackgroudWin);
        }

        return {
            piece: nextPiece,
            backgroudWin: nextPiece,
            displayWin: nextDisplayWin
        }
    })
    .map((i: { piece: PieceBase, backgroudWin: MainWindow, displayWin: MainWindow }) => i.displayWin);



// movingPiece$.subscribe((i) => {
//     for (let y = 0; y < i.currentShape.length; y++) {
//         let s = i.currentShape[y].join(' ');
//         console.log(s);
//     }
//     console.log(`当前位置(x:${i.position.x},y:${i.position.y})`);
//     console.log('');
// });

displayWindow$.subscribe(i => {
    let c = document.getElementById("myCanvas") as HTMLCanvasElement;
    let cxt = c.getContext("2d");
    cxt.clearRect(0, 0, 300, 550);
    for (let y = 4; y < MainWindow.size.height - 1; y++) {
        for (let x = 1; x < MainWindow.size.width - 1; x++) {
            if (i.currentGrid[y][x] == 1) {
                let pX = (x - 1) * 25;
                let py = (y - 4) * 25;
                cxt.strokeRect(pX, py, 25, 25);
            }
        }
    }
})

currentPiece$.next(GenerateRandomPiece());
backgroudWindow$.next(new MainWindow());

