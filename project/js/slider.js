/* variables */
let slider = {};
let sliderCursor = {};
/* functions */
function makeSlider(slider_id, time) {
    slider[slider_id] = $('#' + slider_id);
    sliderCursor[slider_id] = 0;
    let blocks = slider[slider_id].find('.slider_block');
    slider[slider_id].find('button.to_left').click(function(){
        sliderGo(slider_id, 'to_left');
    });
    slider[slider_id].find('button.to_right').click(function(){
        sliderGo(slider_id, 'to_right');
    });
    for (let i = 0; i < blocks.length; i++) {
        slider[slider_id].find('.slider_points').append(`<span onclick="sliderGo('${slider_id}', ${i})">*</span>`);
    }
    blocks.eq(0).addClass('current');
    blocks.eq(1).addClass('next');
    blocks.eq(blocks.length - 1).addClass('prev');
    /*
    setTimeout(function hlpsld(){
        sliderGo(slider_id, 'toleft');
        setTimeout(hlpsld, time);
    }, time);
    */
}
function sliderGo(slider_id, align) {
    let blockparent = slider[slider_id].find('.slider_desk');
    let blocks = slider[slider_id].find('.slider_block');
    /*
    определяем новый current и направление движения слайдов
    */
    if (align == 'to_left') { // next станет current, current станет prev
        sliderCursor[slider_id]++;
        if (sliderCursor[slider_id] >= blocks.length) sliderCursor[slider_id] -= blocks.length;
        align = 'prev';
    } else if (align == 'to_right') { // prev станет current, current станет next
        sliderCursor[slider_id]--;
        if (sliderCursor[slider_id] < 0) sliderCursor[slider_id] += blocks.length;
        align = 'next';
    } else {
        let oldcursor = sliderCursor[slider_id]
        sliderCursor[slider_id] = align;
        if (oldcursor > align) { // новый слайд станет prev, дальше как to_right
            blockparent.find('.prev').removeClass('prev');
            blocks.eq(sliderCursor[slider_id]).addClass('prev');
            align = 'next';
        } else if (oldcursor < align) { // новый слайд станет next, дальше как to_left
            blockparent.find('.next').removeClass('next');
            blocks.eq(sliderCursor[slider_id]).addClass('next');
            align = 'prev';
        } else {
            return;
        }
    }
    let item = blockparent.find('.current'); // запоминаем старый current
    /*
    если align == 'prev':
    next становится current, потом с него убираем класс next
    старый current становится prev, потом с него убираем класс current
    если align == 'next':
    prev становится current, потом с него убираем класс prev
    старый current становится next, потом с него убираем класс current    
    */
    blocks.eq(sliderCursor[slider_id]).addClass('current');
    item.addClass(align).removeClass('current');
    /*
    убираем все prev и next
    */
    blockparent.find('.prev').removeClass('prev');
    console.log(blockparent.find('.prev'));
    blockparent.find('.next').removeClass('next');
    console.log(blockparent.find('.next'));
    /*
    добавляем prev и next соответственно новому current
    */
    blocks.eq((sliderCursor[slider_id] == blocks.length - 1) ? 0 : sliderCursor[slider_id] + 1).addClass('next');
    blocks.eq((sliderCursor[slider_id] == 0) ? blocks.length - 1 : sliderCursor[slider_id] - 1).addClass('prev');
}