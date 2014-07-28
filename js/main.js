
(function( $ ) {
	$.mobile.defaultPageTransition  = "none";
}( jQuery ));

/*$(document).on('pageinit', '#mail-reg-page', function(){
  var validate_img = document.getElementById('validate_img');
  validate_img.onclick = function() {
    validate_img.src= 'http://website120.com/index.php?do=ajax&view=captcha&sid='+Math.random();
    return false;
  };
  
  validate_img.onclick();
  
  $('#mail-reg-btn').click(function() {
    $('.signin-info').hide();
    $('.signin-wait').show();
    $( "#reg_msg_dlg" ).popup("open");
    
    var form = document.getElementById('mail-reg-form');

    $.ajax({
      type: 'POST',
      url: 'http://website120.com/index.php?do=register',
      dataType: 'json',
      data: {
        formhash: 'd3f84d',
        hdn_refer: 'http://website120.com/index.php?do=login',
        account: form.account.value,
        password: form.password.value,
        confirmPassword: form.confirmPassword.value,
        email: form.email.value,
        code: form.code.value,
        agree: '1'
      },
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    }).done(function( msg ) {      
      if (msg.status === "success") {
        $('.reg-info').hide();
        $('.reg-success').show();
      } else if (msg.status === "error") {
        console.log(msg.data.errors);
        var error;
        for(i in msg.data.errors) {
          error = msg.data.errors[i];
        }
        $('#reg_fail_info').text(error);
        $('.reg-info').hide();
        $('.reg-fail').show();
      }
    }).fail(function() {
      $('#reg_fail_info').text('网络访问错误！');
      $('.reg-info').hide();
      $('.reg-fail').show();
    });
  });
});*/

$(document).on('pageinit', '#phone-reg-page', function(){
  var code_btn = $("#code_btn").detach();
  $('#tel').parent().append(code_btn);
  $('#tel').parent().css('position', 'relative');
});

// 登陆
$(document).on('pageinit', '#signin-page', function(){
  /*var validate_img = document.getElementById('validate_img');
  validate_img.onclick = function() {
    validate_img.src= 'http://website120.com/index.php?do=ajax&view=captcha&sid='+Math.random();
    return false;
  };
  
  validate_img.onclick();*/
  
  $('#signin-btn').click(function() {
    $( "#signin_dlg" ).popup("open");
    
    var form = document.getElementById('signin-form');

    $.ajax({
      type: 'POST',
      url: 'http://www.website120.com/index.php?do=login',
      //dataType: 'json',
      data: {
        formhash: 'd3f84d',
        hdn_refer: '',
        account: form.account.value,
        password: form.password.value,
        autoLogin: '1'
      },
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    }).done(function( msg, textStatus, resp) {
      try {
        msg = JSON.parse(msg);
      } catch(err) {
        $('#signin_fail_info').text('登陆失败！');
        $( "#signin_dlg" ).popup("close");
        setTimeout(function(){
          $("#signin_fail_dlg" ).popup("open");
        }, 100);
      }

      if (msg.status === "success") {
        localStorage.setItem('user-name', form.account.value);
        $.mobile.navigate( "index.html" )
      } else if (msg.status === "fail") {
        console.log(msg.data);
        $('#signin_fail_info').text(msg.data);
        $( "#signin_dlg" ).popup("close");
        setTimeout(function(){
          $("#signin_fail_dlg" ).popup("open");
        }, 100);
      }
    }).fail(function(resp) {
      $('#signin_fail_info').text('网络访问错误！');
      $( "#signin_dlg" ).popup("close");
      setTimeout(function(){
        $("#signin_fail_dlg" ).popup("open");
      }, 100);
    });
  });
});


// 城市列表
$.mobile.document.on( "pagecreate", "#cities-page", function(){
	var head = $( ".ui-page-active [data-role='header']" );

	$.mobile.document.on( "click", "#sorter li", function() {
		var top,
			letter = $( this ).text(),
			divider = $( "#sortedList" ).find( "li.ui-li-divider:contains(" + letter + ")" );

		if ( divider.length > 0 ) {
			top = divider.offset().top;
			$.mobile.silentScroll( top );
		} else {
			return false;
		}
	});
	$( "#sorter li" ).hover(function() {
		$( this ).addClass( "ui-btn" ).removeClass( "ui-li-static" );
	}, function() {
		$( this ).removeClass( "ui-btn" ).addClass( "ui-li-static" );
	});
  
  $('#sortedList').find("li>a").each(function(index, item){
    $(item).html($(item).html().substring(1));
  })
  
  $.get('http://api.map.baidu.com/location/ip?ak=00d2b0b25ebf17d46feec01603170ede', function(data) {
    console.log(data);
    $('#gps_city').html(data.content.address_detail.city);
  });
  
  $.mobile.document.on( "scroll", function( e ) {
		var headTop = $(window).scrollTop(),
			foot = $( ".ui-page-active [data-role='footer']" ),
			head = $( ".ui-page-active [data-role='header']" ),
			headerheight = head.outerHeight();

		if( headTop < headerheight && headTop > 0 ) {
			$( "#sorter" ).css({
				"top": headerheight + 15 - headTop,
				"height": window.innerHeight - head[ 0 ].offsetHeight + window.pageYOffset - 10
			});
			$("#sorter li").height( "3.7%" );
		} else if ( headTop >= headerheight && headTop > 0 && parseInt( headTop +
			$.mobile.window.height( )) < parseInt( foot.offset().top ) ) {

			$( "#sorter" ).css({
				"top": "15px",
				"height": window.innerHeight - 8
			});
			$("#sorter li").height( "3.7%" );
		} else if ( parseInt( headTop + window.innerHeight ) >= parseInt( foot.offset().top ) &&
			parseInt( headTop + window.innerHeight ) <= parseInt( foot.offset().top ) +
			foot.height() ) {

			$( "#sorter" ).css({
				"top": "15px",
				"height": window.innerHeight - ( parseInt( headTop + window.innerHeight ) -
					parseInt( foot.offset().top ) + 8 )
			});
		} else if( parseInt( headTop + window.innerHeight ) >= parseInt( foot.offset().top ) ) {
			$( "#sorter" ).css({
				"top": "15px"
			});
		} else {
			$( "#sorter" ).css( "top", headerheight + 15 );
		}
	});
});

$.mobile.document.on( "pageshow", "#cities-page", function() {
	var headerheight = $( ".ui-page-active [data-role='header']" ).outerHeight();
	$( "#sorter" ).height( window.innerHeight - headerheight - 20 ).css( "top", headerheight + 18 );
});

$.mobile.window.on( "throttledresize", function() {
	var headerheight = $( ".ui-page-active [data-role='header']" ).outerHeight();
	$( "#sorter" ).height( window.innerHeight - headerheight - 20 ).css( "top", headerheight + 18 );
});

// 发布任务
$.mobile.document.on( "pageinit", "#publish-page", function() {
	$('.publish-detail>.input-group').removeClass('ui-controlgroup-vertical');
  
  $('div.option').hide();  
  $('#publish-business').change(function(e) {
    var option = $(this).find('option:selected').attr('bind');
    $('div.option').hide();
    $('div.'+option).show();
    console.log($(this).find('option:selected').attr('bind'));
  });
});

// 个人中心
$(document).on('pageshow', '#user-center-page', function(){
  function bindBtnEvents() {
    $('#user-center-page div[list-type]').click(function() {
      $.mobile.navigate( $(this).attr( "href" ));
    });
  }

  /*chrome.cookies.get({url: "http://www.website120.com/", name: "keke_auto_login"}, function(cookie) {
    if (cookie) {*/
      var user = localStorage.getItem('user-name');
      $('.user-info-signin').hide();
      $('.user-info-name').html(user);
      $('.user-info').show();

      bindBtnEvents();
  /*  } else {
      $('.user-info-signin').show();
      $('.user-info').hide();
    }
  });*/
});

$(document).on('pageinit', '#home-page', function(){
  var width = $('.home-btn-group .btn-img').eq(0).width();
  $('.home-btn-group .btn-img').height(width);
  
  $('a[category]').on('click', function(e) {
    e.preventDefault();
    localStorage.setItem('task-category', $(this).attr('category'));
    $.mobile.navigate( $(this).attr( "href" ));
  })
});

$(document).on('pagecreate', '#tasks-page', function(){
  var page = $( this );
  
  // Global navmenu panel
	$( ".jqm-navmenu-panel ul" ).listview();

  $( ".filter-bar>div" ).on( "click", function() {
		page.find( ".jqm-navmenu-panel:not(.jqm-panel-page-nav)" ).panel( "open" );
	});
});

$(document).on('pageshow', '#tasks-page', function(){
  var category = localStorage.getItem('task-category');
  console.log(category);
});
