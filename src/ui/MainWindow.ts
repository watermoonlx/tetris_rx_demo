import { PieceBase } from '../piece/PieceBase';
import { Coordinate } from '../common/Coordinate';

export class MainWindow {
    public currentGrid: number[][];

    public static size = {
        width: 16,
        height: 28
    };

    public static availZone = {
        minX: 2,
        maxX: 13,
        minY: 4,
        maxY: 25
    }

    public static getInitialPosition() {
        return new Coordinate(6, 3);
    }

    constructor(initialGrid?: number[][]) {
        if (initialGrid) {
            this.currentGrid = initialGrid;
        } else {
            this.currentGrid = getInitialGrid();
        }
    }
}

function getInitialGrid() {
    let grid: number[][] = [];
    for (let y = 0; y < MainWindow.size.height; y++) {
        let row = [];
        for (let x = 0; x < MainWindow.size.width; x++) {
            if (x < MainWindow.availZone.minX || x > MainWindow.availZone.maxX || y > MainWindow.availZone.maxY)
                row.push(1);
            else
                row.push(0);
        }
        grid.push(row);
    }
    return grid;
}

export function InsertPieceToWin(piece: PieceBase, mainWin: MainWindow) {
    let clonedWin = cloneMainWindow(mainWin);

    for (let deltaY = 0; deltaY < piece.currentShape.length; deltaY++) {
        let y = piece.position.y + deltaY;
        for (let deltaX = 0; deltaX < piece.currentShape[deltaY].length; deltaX++) {
            let x = piece.position.x + deltaX;
            let flag = piece.currentShape[deltaY][deltaX];
            if (flag == 1)
                clonedWin.currentGrid[y][x] = flag;
        }
    }

    return clonedWin;
}

export function removeFullLine(mainWin: MainWindow) {
    let grid: number[][] = getInitialGrid();

    let line = MainWindow.availZone.maxY;
    for (let y = MainWindow.availZone.maxY; y >= MainWindow.availZone.minY; y--) {
        let row = [];
        let fullFlag = true;
        for (let x = 0; x < MainWindow.size.width; x++) {
            if (mainWin.currentGrid[y][x] == 0) {
                fullFlag = false;
                break;
            }
        }
        if (!fullFlag)
            grid[line--] = mainWin.currentGrid[y];
    }
    return new MainWindow(grid);
}

export function checkGameOver(mainWin: MainWindow) {
    let failed = false;
    for (let x = MainWindow.availZone.minX; x <= MainWindow.availZone.maxX; x++) {
        if (mainWin.currentGrid[3][x] == 1) {
            failed = true;
            break;
        }
    }
    return failed;
}

export function cloneMainWindow(mainWin: MainWindow) {
    let grid: number[][] = [];
    for (let y = 0; y < MainWindow.size.height; y++) {
        let row = [];
        for (let x = 0; x < MainWindow.size.width; x++) {
            row[x] = mainWin.currentGrid[y][x];
        }
        grid.push(row);
    }
    return new MainWindow(grid);
}
