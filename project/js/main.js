/* variables */
let citylist = ['Москва', 'Немосква', 'Караганда', 'Магадан', 'Люберцы', 'Севастополь', 'Ярославль', 'Вологда', 'Владивосток', 'Барнаул', 'Петрозаводск', 'Самара', 'Саратов', 'Тверь', 'Вашингтон', 'Париж', 'Пермь', 'Екатеринбург', 'Новосибирск', 'Калининград'];

/* functions */
function getModalWindow(idname) {
    $('body').append('<div class="screener"></div><div class="modal" id="'+idname+'"><button type="button" class="close">&times;</button></div>');
    $('.screener, .modal .close').click(dropModalWindow);
}
function dropModalWindow() {
    $('.screener, .modal').remove();
}
function actiontimer() {
    let counter = new Date($('.actiontimer').data('actionend'));
    let today = new Date();
    let delta = counter.getTime() - today.getTime();
    let res = true;
    if (delta < 0) {
        delta = 0;
        res = false;
    }
    delta = Math.round(delta/1000);
    let seconds = delta % 60;
    delta = Math.floor(delta/60);
    let minutes = delta % 60;
    delta = Math.floor(delta/60);
    let hours = delta % 24;
    let days = Math.floor(delta/24);
    let helpstr = `${days} ${multiple(days, 'день', 'дня', 'дней')} ${addZero(hours)} ${multiple(hours, 'час', 'часа', 'часов')} ${addZero(minutes)} ${multiple(minutes, 'минута', 'минуты', 'минут')} ${addZero(seconds)} ${multiple(seconds, 'секунда', 'секунды', 'секунд')}`;
    $('.actiontimer').html(helpstr);
    return res;
}
function addZero(num) {
    if (num < 10) {
        num = '0' + num;
    }
    return num;
}
function multiple(num, word1, word2, word3) {
    wnum = num % 100;
    if (((wnum % 10) == 1) && (wnum != 11)) {
        return word1;
    } else if (((wnum % 10) >= 2) && ((wnum % 10) <= 4) && (wnum != 12) && (wnum != 13) && (wnum != 14)) {
        return word2;
    } else {
        return word3;
    }
}

/* on ready */
$(function(){
    $('#city').click(function(){
        getModalWindow('citymodal');
        $('.modal').append('<h1>Выберите город:</h1><input type="text" id="citysearch" placeholder="Введите часть названия города..."><div class="columns"></div>');
        for (let city of citylist) {
            $('.modal .columns').append('<p>' + city + '</p>');
        }
        $('.modal p').click(function(){
            $('#city span').html($(this).html());
            dropModalWindow();
        });
        $('#citysearch').on('input', function(){
            let namepart = $('#citysearch').val().toLowerCase();
            $('.modal p').each(function(){
                if (!this.innerHTML.toLowerCase().includes(namepart)) {
                    this.style.display = 'none';
                } else {
                    this.style.display = 'block';
                }
            });
        });
    });
    
    if ($('.action').length) {
        actiontimer();
        let timer0 = setInterval(function(){
            if (!actiontimer()) clearInterval(timer0);
        }, 1000);
    }
    
    $('.slider').each(function(){
        makeSlider(this.id, 2000);
    });
    
    if ($('.catmenu li li').length) {
        if ($('.catmenu.simple').length) { // если мы хотим простейший аккордеон без сложной анимации
            $('.catmenu > ul > li').click(function(e){
                if (e.target.tagName != 'A') {
                    $('.open').removeClass('open'); // отнимаем класс open у ранее открытого вложенного списка
                    $(this).find('ul').addClass('open'); // добавляем класс open вложенному списку в кликнутом пункте
                }
            });
        } else { // если мы хотим аккордеон с более красивой анимацией
            $('.catmenu li li').slideUp(1); // скрываем все пункты второго уровня
            $('.catmenu > ul > li').click(function(e){ // ловим клик на пункте первого уровня
                if ((e.target.tagName != 'A') && (!$(this).find('.open').length)) { // если клик не был по ссылке и вложенный список в этом пункте уже не раскрыт...
                    let here = $(this).find('ul'); // сохраняем указатель на вложенный список в кликнутом пункте 
                    if (here.length) { // если в кликнутом пункте есть вложенный список...
                        if ($('.catmenu .open').length) { // если был раскрытый вложенный список...
                            $('.catmenu .open li').slideUp(1000, function(){ // прячем его пункты
                                $('.catmenu .open').removeClass('open'); // затем убираем с него класс open
                                here.find('li').slideDown(1000, function(){ // затем открываем пункты списка по нашему указателю
                                    here.addClass('open'); // и вешаем на него класс open
                                });
                            });
                        } else { // если раскрытого вложенного списка не было...
                            here.find('li').slideDown(1000, function(){ // открываем пункты списка по нашему указателю
                                here.addClass('open'); // и вешаем на него класс open
                            });
                        }
                    } else {
                        if ($('.catmenu .open').length) { // если был раскрытый вложенный список...
                            $('.catmenu .open li').slideUp(1000, function(){ // прячем его пункты
                                $('.catmenu .open').removeClass('open'); // затем убираем с него класс open
                            });
                        }
                    }
                }
            });
        }
    }
    
    // if ($('.querymenu').length) {
        // $( "#acco" ).accordion({
            // header: ".acco_h",
            // icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" }
        // });
        // $( "#toggle" ).button().on( "click", function() {
            // if ( $( "#acco" ).accordion( "option", "icons" ) ) {
                // $( "#acco" ).accordion( "option", "icons", null );
            // } else {
                // $( "#acco" ).accordion( "option", "icons", icons );
            // }
        // });
    // }
    
    
    console.log('just loaded');
});