var myModule = (function () {

	// Инициализирует наш модуль
	var init = function () {
    _setUpListners();
    _startSlider();
	};

	// Прослушивает событие
	var _setUpListners = function () {
    // Вызов модального окна заказа звонка
    $('#toggle-phone').on('click', _showModal); // Открыть модальное окно
	};

	// Запускает слайдер
	var _startSlider = function () {
    $('.slideshow').unslider({
      animateHeight: true,
      arrows: false,
	  autoplay: false, 
	  delay: 1000
    });
	};

	// Показывает модальное окно
	var _showModal = function (ev) {
		ev.preventDefault();
    $('#modal-phone').bPopup({
      speed: 650,
      closeClass:'modal__close',
      modalClose: false
    //   transition: 'slideDown',
    //   transitionClose: 'slideBack' 
    });
	};

	// Возвращаем объект (публичные методы)
	return {
		init : init
	};

})();

myModule.init();