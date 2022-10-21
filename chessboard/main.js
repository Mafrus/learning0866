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
let figureset = []; // коллекция фигур, стоящих сейчас на доске
let startpos = [ // описание начальной расстановки фигур
    ['king','white','e1'],
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
    let vert = [8, 7, 6, 5, 4, 3, 2, 1][Math.floor(idx / 8)]; // строки
    let hor = 'abcdefgh'[idx % 8]; // столбцы
    return hor + vert;
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
        cell.classList.add('cellfrom');
        console.log('from -->');
    } else { // если есть помеченное стартовое поле, помечаем текущее поле финишным
        if (cell.classList.contains('cellfrom')) {
            cell.classList.remove('cellfrom');
            console.log('canceled');
            return;
        }
        cell.classList.add('cellto');
        console.log('--> to');
    }
    console.log(getCellPosition(cell));
    console.log(checkFigureInCell(cell));
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
}
