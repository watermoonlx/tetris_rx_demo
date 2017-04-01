import { PieceBase } from '../piece/PieceBase';
import { Coordinate } from '../common/Coordinate';

export class MainWindow {
    public currentGrid: number[][];

    public static size = {
        width: 14,
        height: 27
    };

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
            if (x == 0 || x == MainWindow.size.width - 1 || y == MainWindow.size.height - 1)
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

export function calculateMainWindow(mainWin: MainWindow) {
    let grid: number[][] = getInitialGrid();

    for (let y = MainWindow.size.height - 2; y >= 0; y--) {
        let row = [];
        let fullFlag = true;
        for (let x = 0; x < MainWindow.size.width; x++) {
            row[x] = mainWin.currentGrid[y][x];
            if (row[x] == 0)
                fullFlag = false;
        }
        if (!fullFlag)
            grid[y] = row;
    }
    return new MainWindow(grid);
}

export function checkGameOver(mainWin: MainWindow) {
    debugger;
    let failed = false;
    for (let x = 1; x < MainWindow.size.width - 1; x++){
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
