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
        return false;
    },
    rook(a, b) {
        return false;
    },
    bishop(a, b) {
        return false;
    },
    knight(a, b) {
        return false;
    },
    pawn(a, b) {
        return false;
    },
};
let figureset = []; // коллекция фигур, стоящих сейчас на доске
let startpos = [ // описание начальной расстановки фигур
    ['king','white','e1'],
    ['king','black','e8'],
    ['queen','white','d1'],
    ['pawn','white','c2'],
    ['rook','black','a8'],
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
function getCellCoords(pos) {
    a = 'abcdefgh'.indexOf(pos[0]);
    b = '87654321'.indexOf(pos[1]);
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
    if ((!aim) || (aim.color != figure.color)) {
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


/* classes */
class ChessFigure { // каждый объект класса - шахматная фигура, имеет название, цвет, позицию на доске
    constructor(name, color, position){
        this.name = name;
        this.color = color;
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
        this.render();
    }
}


