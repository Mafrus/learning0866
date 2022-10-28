/* variables */
let arr; // переменная, чтобы положить в нее коллекцию всех полей
const FIGURESYMBOL = { // набор изображений для фигур
    king: {
        white: '&#9812;',
        black: '&#9818;'
    },
    queen: {
        white: '&#9813;',
        black: '&#9819;'
    },
    rook: {
        white: '&#9814;',
        black: '&#9820;'
    },
    bishop: {
        white: '&#9815;',
        black: '&#9821;'
    },
    knight: {
        white: '&#9816;',
        black: '&#9822;'
    },
    pawn: {
        white: '&#9817;',
        black: '&#9823;'
    }
};
const FIGUREMOVE = {
    king(a, b) {
        return (Math.abs(a.x - b.x) <= 1) && (Math.abs(a.y - b.y) <= 1);
    },
    queen(a, b) {
        return FIGUREMOVE.rook(a, b) || FIGUREMOVE.bishop(a, b);
    },
    rook(a, b) {
        if ((a.x == b.x) || (a.y == b.y)) {
            if (Math.abs(a.x - b.x + a.y - b.y) == 1) {
                return true;
            }
            if (a.x == b.x) {
                if (a.y < b.y) {
                    start = a.y + 1;
                    stop = b.y;
                } else {
                    start = b.y + 1;
                    stop = a.y;
                }
                for (let i = start; i < stop; i++) {
                    if (checkFigureInCell(getCellFromCoords(a.x, i))) return false;
                }
            } else {
                if (a.x < b.x) {
                    start = a.x + 1;
                    stop = b.x;
                } else {
                    start = b.x + 1;
                    stop = a.x;
                }
                for (let i = start; i < stop; i++) {
                    if (checkFigureInCell(getCellFromCoords(i, a.y))) return false;
                }
            }
            return true;
        } else {
            return false;
        }
    },
    bishop(a, b) {
        if ((a.x + a.y == b.x + b.y) || (a.x - a.y == b.x - b.y)) {
            if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) == 2) {
                return true;
            }
            if (a.x + a.y == b.x + b.y) {
                if (a.x > b.x) {
                    start = b.x + 1;
                    stop = a.x;
                } else {
                    start = a.x + 1;
                    stop = b.x;
                }
                for (let i = start; i < stop; i++) {
                    if (checkFigureInCell(getCellFromCoords(i, a.x + a.y - i))) return false;
                }
            } else {
                if (a.x > b.x) {
                    start = b.x + 1;
                    stop = a.x;
                } else {
                    start = a.x + 1;
                    stop = b.x;
                }
                for (let i = start; i < stop; i++) {
                    if (checkFigureInCell(getCellFromCoords(i, i - b.x + b.y))) return false;
                }
            }
            return true;
        } else {
            return false;
        }
    },
    knight(a, b) {
        return ((Math.abs(a.x - b.x) == 1) && (Math.abs(a.y - b.y) == 2)) || ((Math.abs(a.x - b.x) == 2) && (Math.abs(a.y - b.y) == 1));
    },
    whitepawngo(a, b) {
        return false;
    },
    blackpawngo(a, b) {
        return false;
    },
    whitepawnbeat(a, b) {
        return false;
    },
    blackpawnbeat(a, b) {
        return false;
    },
    castling(a, b) {
        return false;
    },
};
let figureset = []; // коллекция фигур, стоящих сейчас на доске
let startpos = [ // описание начальной расстановки фигур
    ['king','white','e1'],
    ['king','black','e8'],
    ['queen','white','d1'],
    ['queen','black','d8'],
    ['rook','white','a1'],
    ['rook','black','a8'],
    ['rook','white','h1'],
    ['rook','black','h8'],
    ['bishop','white','c1'],
    ['bishop','black','c8'],
    ['bishop','white','f1'],
    ['bishop','black','f8'],
    ['knight','white','b1'],
    ['knight','black','b8'],
    ['knight','white','g1'],
    ['knight','black','g8']
]


/* main */
document.addEventListener('DOMContentLoaded', function(){
    arr = document.querySelectorAll('td'); // коллекция всех полей
    for (const cell of arr) {
        cell.addEventListener('click', e => useCell(e.target)); // добавляем обработчик клика по каждому полю
    }
    startpos.forEach(item => { // расставляем фигуры на доске
        figure = new ChessFigure(...item);
        figure.render();
        figureset.push(figure);
    });
    
    
    
});



/* functions */
function getCellFromCoords(x, y) { // по числовым координатам находим само поле
    return arr[x + (y * 8)];
}
function getCellFromPosition(position) { // по координатам "буква + цифра" находим само поле
    for (const cell of arr) {
        if (getCellPosition(cell) == position) return cell;
    }
    throw "несуществующие координаты " + position; // выбрасываем ошибку в случае несуществующих координат
}
function getCellPosition(cell) { // по самому полю находим его координаты "буква + цифра"
    let idx = [].indexOf.call(arr, cell);
    let vert = '87654321'[Math.floor(idx / 8)]; // строки
    let hor = 'abcdefgh'[idx % 8]; // столбцы
    return hor + vert;
}
function getCellCoords(position) { // по координатам "буква + цифра" находим числовые координаты
    a = 'abcdefgh'.indexOf(position[0]);
    b = '87654321'.indexOf(position[1]);
    return {x: a, y: b};
}
function checkFigureInCell(cell) { // проверяем, есть ли фигура с координатами, как у нашего поля.
    let pos = getCellPosition(cell);
    for (let f of figureset) {
        if (f.position == pos) {
            return f; // если фигура найдена, возвращаем ее
        }
    }
    return false;
}
function useCell(cell) {
    if (!document.querySelector('.cellfrom') || document.querySelector('.cellto')){ // если нет помеченных полей, помечаем текущее поле стартовым. если есть помеченные оба поля,
        if (document.querySelector('.cellto')) {
            document.querySelector('.cellfrom').classList.remove('cellfrom');
            document.querySelector('.cellto').classList.remove('cellto');
        }
        if (checkFigureInCell(cell)) {
            cell.classList.add('cellfrom');
        }
    } else { // если есть помеченное стартовое поле, помечаем текущее поле финишным
        if (cell.classList.contains('cellfrom')) {
            cell.classList.remove('cellfrom');
        } else {
            if (canIMove(cell)) {
                cell.classList.add('cellto');
                figureMove();
            }
        }
    }
}
function canIMove(cellto) {
    let cellfrom = document.querySelector('.cellfrom');
    let figure = checkFigureInCell(cellfrom);
    let aim = checkFigureInCell(cellto);
    // надо добавить проверки на пешку и на рокировку
    if (figure.name == 'pawn') {
        console.log('это пешка');
        return false;
    }
    if ((!aim) || (aim.color != figure.color)) {
        if ((figure.name == 'king') && (FIGUREMOVE['castling'](getCellCoords(getCellPosition(cellfrom)), getCellCoords(getCellPosition(cellto))))) {
            return makeCastling(cellfrom, cellto);
        }
        return FIGUREMOVE[figure.name](getCellCoords(getCellPosition(cellfrom)), getCellCoords(getCellPosition(cellto)));
    }
    return false;
}
function figureMove() {
    let cellfrom = document.querySelector('.cellfrom');
    let cellto = document.querySelector('.cellto');
    let figure = checkFigureInCell(cellfrom);
    let aim = checkFigureInCell(cellto);
    let logsymbol = '-';
    if (aim) {
        figureset.splice(figureset.indexOf(aim), 1);
        logsymbol = ':';
    }
    figure.changePos(cellto);
    console.log(`${figure.color} ${figure.name}: ${getCellPosition(cellfrom)} ${logsymbol} ${getCellPosition(cellto)}.`);
    document.querySelector('.cellfrom').classList.remove('cellfrom');
    document.querySelector('.cellto').classList.remove('cellto');
}
function makeCastling(cellfrom, cellto) {
    // заглушка
    
    return false;
}


/* classes */
class ChessFigure { // каждый объект класса - шахматная фигура, имеет название, цвет, позицию на доске
    constructor(name, color, position){
        this.name = name;
        this.color = color;
        this.firststep = true;
        this.position = position.toLowerCase();
    }
    render(){ // показываем фигуру на доске
        getCellFromPosition(this.position).innerHTML = FIGURESYMBOL[this.name][this.color];
    }
    clear(){ // убираем фигуру с доски
        getCellFromPosition(this.position).innerHTML = '';
    }
    changePos(cell){ // меняем позицию фигуры
        this.clear();
        this.position = getCellPosition(cell);
        this.firststep = false;
        this.render();
    }
}


