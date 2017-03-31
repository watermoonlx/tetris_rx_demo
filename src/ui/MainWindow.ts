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

function cloneMainWindow(mainWin: MainWindow) {
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

export function InsertPieceToWin(piece: PieceBase, mainWin: MainWindow) {
    debugger;
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
