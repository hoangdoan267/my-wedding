/*----------------------------------------------------
	L'AMORE WEDDING TEMPLATE.

	Author:			theme_div
	Type:          	JS
	Last Update:   	30.09.2018

	[Table of contents]
	1. Counter
	2. Slider
	3. Animate on Scroll
	4. Masonry gallery
	5. Mobile Menu (open/close)
	6. Navigation
	7. RSVP Form submission
	8. Functions
		8.1. Validate E-mail
		8.1. Get sections offset
		8.1. Set navbar active link
		8.1. Debouncer

----------------------------------------------------*/

(function ($) {
  "use strict";

  /*==== 4. Masonry gallery ====*/
  var $grid = $(".grid").masonry({
    itemSelector: ".grid-item",
    //columnWidth: '.grid-sizer',
    gutter: ".gutter-sizer",
  });

  // layout Masonry after each image loads
  $grid.imagesLoaded().progress(function () {
    $grid.masonry("layout");
  });

  /*==== 5. Mobile menu (open/close) ====*/
  $(document).on("click", ".js-open-menu", function (e) {
    e.preventDefault();
    var $self = $(this);
    var $icon = $(".icon", $self);
    var iconName = $icon.attr("name");

    var iconAttr = iconName == "menu" ? "close" : "menu";
    $icon.attr("name", iconAttr);
    $(".js-menu").slideToggle("slow");
    $icon.toggleClass("icon--black");
  });

  /*==== 6. Single page navigation ====*/
  var sectionsInfo = getSectionsOffset();
  $(window).on("resize", function () {
    sectionsInfo = getSectionsOffset();
  });

  $(document).on("click", ".js-nav-link", function (e) {
    e.preventDefault();

    var target = $(this).attr("href");

    $("html, body").animate(
      {
        scrollTop: $(target).offset().top - 100,
      },
      1000
    );
  });

  //   $(window).on("scroll", debounce(setActiveNavLink, 50));

  /*==== 7. RSVP Form submission ====*/
  $("#reservation-form").on("submit", function (e) {
    e.preventDefault();
    var $form = $(this);
    var formData = $form.serialize();

    $("#submit-button").attr("disabled", true);
    $("#cta-btn").text("Sending to us");
    $(".loader").css("display", "inline-block");

    $.ajax({
      method: "POST",
      dataType: "json",
      url: "https://script.google.com/macros/s/AKfycbyaDVe4ubpkAiWpp-aJ9wJeUnJqYMXRi5h4sLFaogWGt545X_AEKdppVEIeeBrYoz07/exec",
      data: formData,
    })
      .done(function (response) {
        $("#cta-btn").text("Thank you");
        $("html, body").animate({
          scrollTop: $("#thank-you").offset().top,
        });
      })
      .fail(function (res) {
        $("#cta-btn").text("Send a message");
        $("#submit-button").attr("disabled", false);
      })
      .always(function (res) {
        $(".loader").css("display", "none");
      });
  });

  //8.2. Get section offset (used for setting active link)
  function getSectionsOffset() {
    var sections = $(".js-section");
    var sectionsInfo = [];

    sections.each(function () {
      var $self = $(this);
      sectionsInfo.push({
        id: $self.attr("id"),
        offset: $self.offset().top - 100,
      });
    });

    return sectionsInfo;
  }

  // 8.3. Set active link
  function setActiveNavLink() {
    var scrollPosition = $(window).scrollTop() + 53;
    for (var i = 0; i < sectionsInfo.length; i++) {
      if (scrollPosition >= sectionsInfo[i].offset) {
        $(".js-nav-link").removeClass("active");
        $('.js-nav-link[href="#' + sectionsInfo[i].id + '"]').addClass(
          "active"
        );
      }
    }
  }

  //8.4 Debouncer.
  function debounce(func, wait) {
    var timeout;
    var later = function () {
      timeout = undefined;
      func.call();
    };

    return function () {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(later, wait);
    };
  }
})(jQuery);
