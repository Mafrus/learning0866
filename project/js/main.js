/* variables */
let sliderCursor = 0;
let slider;

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
function makeSlider(slider) {
    let blocks = slider.find('.slider_block');
    blocks.eq(0).addClass('current');
    blocks.eq(1).addClass('next');
    blocks.eq(blocks.length - 1).addClass('prev');
    setTimeout(function hlpsld(){
        sliderGo(slider, 'toleft');
        setTimeout(hlpsld, 3000);
    }, 3000);
}
function sliderGo(slider, align) {
    let blocks = slider.find('.slider_block');
    if (align == 'toleft') {
        sliderCursor++;
        if (sliderCursor >= blocks.length) sliderCursor -= blocks.length;
    } else if (align == 'toright') {
        sliderCursor--;
        if (sliderCursor < 0) sliderCursor += blocks.length;
    } else {
        sliderCursor = align;
    }
    let item = slider.find('.current');
    blocks.eq(sliderCursor).addClass('current');
    item.removeClass('current');
    item = slider.find('.prev');
    blocks.eq(sliderCursor - 1).addClass('prev');
    item.removeClass('prev');
    item = slider.find('.next');
    blocks.eq((sliderCursor == blocks.length - 1) ? 0 : sliderCursor + 1).addClass('next');
    item.removeClass('next');
}

/* on ready */
$(function(){
    $('#city').click(function(){
        getModalWindow('citymodal');
        $('.modal').append('<h1>Выберите город:</h1><p>Москва</p><p>Немосква</p><p>Караганда</p><p>Магадан</p><p>Люберцы</p>');
        $('.modal p').click(function(){
            $('#city span').html($(this).html());
            dropModalWindow();
        });
    });
    
    actiontimer();
    let timer0 = setInterval(function(){
        if (!actiontimer()) clearInterval(timer0);
    }, 1000);
    
    slider = $('.slider');
    makeSlider(slider);
    
    console.log('just loaded');
});