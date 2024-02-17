
// Триггерим сигнал при инициализации

$(document).ready(function() {
    $('input').trigger('input');
});


// Обработчик ошибок картинок
$('img[errorcap]').on('onerror', function() {
    $(this).attr("src", "/assets/images/image-not-found.webp")
});


// Функция динамической подсветки input элементов

$('input[displaylimit]').on('input', function() {
    const myText = $(this).val();
    const maxLength = $(this).attr('maxlength');
    const minLength = $(this).attr('minlength');

    if ((maxLength && myText.length > maxLength) || (minLength && myText.length < minLength)) {
        $(this).addClass('limit');
    } else {
        $(this).removeClass('limit');
    }
});


// Функция динамической длины input элементов

$('input[dynamlen]').on('input', function() {
    const elem = $(this);
    if ((!elem.hasAttr('empty-width')) || (elem.val().length > 0 && elem.hasAttr('empty-width'))) {
        elem.css('width', 0);
        elem.css('width', elem[0].scrollWidth + 8 + "px");
    } else {
        elem.css('width', elem.attr('empty-width'))
    }
});


// Дополняем jquery логику
$.fn.hasAttr = function(name) {  
    return this.attr(name) !== undefined;
 };
