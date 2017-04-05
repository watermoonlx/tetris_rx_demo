import "babel-polyfill";
import * as Rx from 'rxjs';
import { GenerateRandomPiece, Move, Rotate } from './piece/PieceActions';
import { Action } from './common/ConstValue';
import { PieceBase } from './piece/Pieces';
import { MainWindow, InsertPieceToWin, removeFullLine, checkGameOver, cloneMainWindow } from './ui/MainWindow';
import { Keyboard } from './common/Keyboard';
import { GameStatus } from './common/GameStatus';

const rootTick$ = Rx.Observable
    .interval(100)
    .share();

const gameStatus$ = new Rx.Subject<GameStatus>();

const tick$ = rootTick$.throttleTime(1000);

const nextPiecePreview$ = new Rx.Subject<PieceBase>();
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
    });

const tickAction$ = tick$
    .mapTo(Action.Down);

const command$ = gameStatus$.switchMap(i => {
    switch (i) {
        case GameStatus.normal: return Rx.Observable.merge(userAction$, tickAction$);;
        case GameStatus.over:
        case GameStatus.pause: return Rx.Observable.never()
    }
});


const displayWindow$ = command$
    .withLatestFrom(currentPiece$, backgroudWindow$, (i, j, k) => {
        return {
            action: i,
            piece: j,
            backgroudWin: k
        }
    })
    .map(i => {
        let nextPiece: PieceBase;

        switch (i.action) {
            case Action.Down: nextPiece = Move('down')(i.piece, i.backgroudWin); break;
            case Action.Left: nextPiece = Move('left')(i.piece, i.backgroudWin); break;
            case Action.Right: nextPiece = Move('right')(i.piece, i.backgroudWin); break;
            case Action.Rotate: nextPiece = Rotate(i.piece, i.backgroudWin); break;
            default: break;
        }

        currentPiece$.next(nextPiece);

        return {
            piece: nextPiece,
            backgroudWin: i.backgroudWin
        }
    })
    .map(i => {
        let displayWin: MainWindow = null;
        if (i.piece.continue) {
            displayWin = InsertPieceToWin(i.piece, i.backgroudWin);
        }
        return {
            piece: i.piece,
            backgroudWin: i.backgroudWin,
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
            nextDisplayWin = removeFullLine(prev.displayWin);
            if (checkGameOver(nextDisplayWin)) {
                gameStatus$.next(GameStatus.over);
                paintWinTask.unsubscribe();
                paintNextPieceView.unsubscribe();
                console.log('Game Over');
            } else {
                nextBackgroudWin = cloneMainWindow(nextDisplayWin);
            }

            nextPiece = GenerateRandomPiece();
            nextPiecePreview$.next(nextPiece);
            backgroudWindow$.next(nextBackgroudWin);
        }

        return {
            piece: nextPiece,
            backgroudWin: nextBackgroudWin,
            displayWin: nextDisplayWin
        }
    })
    .map((i: { piece: PieceBase, backgroudWin: MainWindow, displayWin: MainWindow }) => i.displayWin);

let paintWinTask = displayWindow$.subscribe(i => {
    let c = document.getElementById("myCanvas") as HTMLCanvasElement;
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 300, 550);
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 550);
    ctx.stroke();
    for (let y = MainWindow.availZone.minY; y <= MainWindow.availZone.maxY; y++) {
        for (let x = MainWindow.availZone.minX; x <= MainWindow.availZone.maxX; x++) {
            if (i.currentGrid[y][x] == 1) {
                let pX = (x - 2) * 25;
                let pY = (y - 4) * 25;
                ctx.strokeRect(pX, pY, 25, 25);
                ctx.fillStyle = "#4fbb54";
                ctx.fillRect(pX, pY, 25, 25);
            }
        }
    }
});

let paintNextPieceView = nextPiecePreview$
    .pairwise()
    .subscribe(i => {
        let [prevPiece, curPiece] = i;

        let c = document.getElementById("myCanvas") as HTMLCanvasElement;
        let ctx = c.getContext("2d");
        ctx.clearRect(300, 0, 450, 300);
        let maxY = curPiece.currentShape.length;
        let maxX = curPiece.currentShape[0].length;
        for (let y = 0; y < maxY; y++) {
            for (let x = 0; x < maxX; x++) {
                if (curPiece.currentShape[y][x] == 1) {
                    let pX = x * 25 + 325;
                    let pY = y * 25 + 100;
                    ctx.strokeRect(pX, pY, 25, 25);
                    ctx.fillStyle = "#4fbb54";
                    ctx.fillRect(pX, pY, 25, 25);
                }
            }
        }

        currentPiece$.next(prevPiece);
    });

gameStatus$
    .filter(i => i == GameStatus.over)
    .subscribe(i => {
        let c = document.getElementById("myCanvas") as HTMLCanvasElement;
        let ctx = c.getContext("2d");
        ctx.fillStyle = "#d04437";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", 100, 200);
    });

(function initialize() {
    nextPiecePreview$.next(GenerateRandomPiece());
    nextPiecePreview$.next(GenerateRandomPiece());
    gameStatus$.next(GameStatus.normal);
    backgroudWindow$.next(new MainWindow());
} ());

