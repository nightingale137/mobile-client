
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
    //********* Test
    localStorage.setItem('user-name', 'Tester');
    $.mobile.back();
    return;

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

// 账号
$(document).on('pageinit', '#account-page', function(){
  $('#exit-account-btn').click(function() {
    localStorage.removeItem('user-name');
    $.mobile.back();
  });
});

// 城市列表
$.mobile.document.on( "pagecreate", "#cities-page", function(){
	var head = $( ".ui-page-active [data-role='header']" );

  var cities;
  $.get('js/cities.json', function(result) {
    cities = JSON.parse(result);
    console.log(cities);
  });

  var onCitySelected = function() {
    var provices = cities.result[0];
    var municipals = cities.result[1];
    var city_fullname = '';
    var start = -1;
    var end = -1;
    var i = 0;

    for (; i < provices.length; i ++) {
      if (provices[i].fullname && provices[i].fullname.indexOf($(this).children().eq(0).html().trim()) === 0) {
        provices[i].cidx;
        start = provices[i].cidx[0];
        end = provices[i].cidx[1];
        city_fullname = provices[i].fullname;
        break;
      }
    }
    if (i < provices.length && start >= -1 && end >= -1) {
      localStorage.city_start = start;
      localStorage.city_end = end;
      localStorage.sub_city_level = 1;
      localStorage.city_fullname = city_fullname;
      $.mobile.navigate("#sub_city_page");
      return;
    }

    start = -1;
    end = -1;
    i = 0;
    for (; i < municipals.length; i ++) {
      if (municipals[i].fullname && municipals[i].fullname.indexOf($(this).children().eq(0).html().trim()) === 0) {
        if (!municipals[i].cidx) {
          $.mobile.navigate("#home-page");
          return;
        }
        start = municipals[i].cidx[0];
        end = municipals[i].cidx[1];
        city_fullname = municipals[i].fullname;
        break;
      }
    }

    if (i < municipals.length && start >= -1 && end >= -1) {
      localStorage.city_start = start;
      localStorage.city_end = end;
      localStorage.sub_city_level = 2;
      localStorage.city_fullname = city_fullname;
      $.mobile.navigate("#sub_city_page");
    }
  }

  $.mobile.document.on( "click", "#sortedList li", onCitySelected);
  $.mobile.document.on( "click", "#hotCityList li", onCitySelected);

  $.mobile.document.on( "click", "#sorter li", function() {
    var top,
      letter = $( this ).text(),
      divider = $( "#sortedList" ).find( "li.ui-li-divider:contains(" + letter + ")" );

    if ( divider.length > 0 ) {
      top = divider.offset().top - $( ".ui-page-active [data-role='header']" ).outerHeight();
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

  //&ip=61.153.34.3
  $.get('http://api.map.baidu.com/location/ip?ak=00d2b0b25ebf17d46feec01603170ede&coor=bd09ll', function(data) {
    console.log(data);
    var x = data.content.point.x;
    var y = data.content.point.y;
    var service_addr = 'http://api.map.baidu.com/geocoder/v2/?ak=00d2b0b25ebf17d46feec01603170ede&output=json&pois=0&coordtype=bd09ll&location='+y+','+x;
    $.ajax({url:service_addr,dataType:'text'}).done(function(addr) {
      var location = JSON.parse(addr);
      $('#gps_city').html(location.result.addressComponent.city + location.result.addressComponent.district);
    });
    //$('#gps_city').html(data.content.address_detail.city);
  });

//  $.mobile.document.on( "scroll", function( e ) {
//		var headTop = $(window).scrollTop(),
//			foot = $( ".ui-page-active [data-role='footer']" ),
//			head = $( ".ui-page-active [data-role='header']" ),
//			headerheight = head.outerHeight();
//
//		if( headTop < headerheight && headTop > 0 ) {
//			$( "#sorter" ).css({
//				"top": headerheight + 15 - headTop,
//				"height": window.innerHeight - head[ 0 ].offsetHeight + window.pageYOffset - 10
//			});
//			$("#sorter li").height( "3.7%" );
//		} else if ( headTop >= headerheight && headTop > 0 && parseInt( headTop +
//			$.mobile.window.height( )) < parseInt( foot.offset().top ) ) {
//
//			$( "#sorter" ).css({
//				"top": "15px",
//				"height": window.innerHeight - 8
//			});
//			$("#sorter li").height( "3.7%" );
//		} else if ( parseInt( headTop + window.innerHeight ) >= parseInt( foot.offset().top ) &&
//			parseInt( headTop + window.innerHeight ) <= parseInt( foot.offset().top ) +
//			foot.height() ) {
//
//			$( "#sorter" ).css({
//				"top": "15px",
//				"height": window.innerHeight - ( parseInt( headTop + window.innerHeight ) -
//					parseInt( foot.offset().top ) + 8 )
//			});
//		} else if( parseInt( headTop + window.innerHeight ) >= parseInt( foot.offset().top ) ) {
//			$( "#sorter" ).css({
//				"top": "15px"
//			});
//		} else {
//			$( "#sorter" ).css( "top", headerheight + 15 );
//		}
//	});
});
$.mobile.document.on( "pageshow", "#cities-page", function() {
  var headerheight = $( ".ui-page-active [data-role='header']" ).outerHeight();
  $( "#sorter" ).height( window.innerHeight - headerheight - 20 ).css( "top", headerheight + 18 );
});

$.mobile.window.on( "throttledresize", function() {
  var headerheight = $( ".ui-page-active [data-role='header']" ).outerHeight();
  $( "#sorter" ).height( window.innerHeight - headerheight - 20 ).css( "top", headerheight + 18 );
});
// 县级城市列表
$.mobile.document.on("pagebeforeshow", "#sub_city_page", function(){
  var head = $( ".ui-page-active [data-role='header']" );

  var cities;
  $.get('js/cities.json', function(result) {
    cities = JSON.parse(result);
    var start = parseInt(localStorage.city_start);
    var end = parseInt(localStorage.city_end);
    var city_level = parseInt(localStorage.sub_city_level);
    var town = cities.result[city_level];
    console.log(town[start]);

    $('#sub_city_list').children().remove();
    for (var i = start; i <= end; i++) {
      var item = $('<li><a href="#" class="ui-btn ui-btn-icon-right ui-icon-carat-r">' + town[i].fullname + '</a></li>');
      $('#sub_city_list').append(item);
      item.click(function() {
        var city_target = localStorage.getItem('city-target');
        if (city_target === 'home_city') {
          $('#' + city_target).html(localStorage.city_fullname + $(this).find('a').html());
          localStorage.current_city = localStorage.city_fullname + $(this).find('a').html();
        } else if(city_target === 'task_zone_filter') {
          $('#' + city_target).html(localStorage.city_fullname + $(this).find('a').html());
        } else {
          $('#' + city_target).val(localStorage.city_fullname + $(this).find('a').html());
        }
        window.history.go(-2);
      });
    }
  });

//  $.mobile.document.on( "click", "#sortedList li", function() {
//  });
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

  $('#publish-btn').click(function() {
    $.mobile.navigate("#publish-success-page");
  });

  $('#publish-exec_zone').click(function() {
    localStorage.setItem('city-target', 'publish-exec_zone');
    $.mobile.navigate("#cities-page");
  });

});

// 个人中心
$(document).on('pagecreate', '#user-center-page', function(){
  $('#user-center-page .user-info').click(function() {
    $.mobile.navigate( $(this).attr( "href" ));
  });
});

$(document).on('pageshow', '#user-center-page', function(){
  function bindBtnEvents() {
    $('#user-center-page div[list-type]').click(function() {
      $.mobile.navigate( $(this).attr( "href" ));
    });

    $('#user-center-page .my-fav-page').click(function() {
      $.mobile.navigate( $(this).attr( "href" ));
    });
  }

  /*chrome.cookies.get({url: "http://www.website120.com/", name: "keke_auto_login"}, function(cookie) {
    if (cookie) {*/
    var user = localStorage.getItem('user-name');
    if (user) {
      //var user = localStorage.getItem('user-name');
      $('.user-info-signin').hide();
      $('.user-info-name').html(user);
      $('.user-info').show();

      bindBtnEvents();
    } else {
      $('.user-info-signin').show();
      $('.user-info').hide();
    }
  //});
});

$(document).on('pageinit', '#home-page', function(){
  var width = $('.home-btn-group .btn-img').eq(0).width();
  $('.home-btn-group .btn-img').height(width - 20);
  
  $('a[category]').on('click', function(e) {
    e.preventDefault();
    localStorage.setItem('task-category', $(this).attr('category'));
    $.mobile.navigate( $(this).attr( "href" ));
  })

  $('#home_city').click(function() {
    localStorage.setItem('city-target', 'home_city');
    $.mobile.navigate("#cities-page");
    e.preventDefault();
  });

  if (localStorage.current_city) {
    $('#home_city').html(localStorage.current_city);
  }
});

$(document).on('pagecreate', '#tasks-page', function(){
  var page = $( this );
  
  // Global navmenu panel
	$( ".jqm-navmenu-panel ul" ).listview();

  $( "#tasks-type" ).on( "click", function() {
		page.find( ".jqm-navmenu-panel:not(.jqm-panel-page-nav)" ).panel( "open" );
	});

  $('#task_zone_filter').click(function() {
    localStorage.setItem('city-target', 'task_zone_filter');
    $.mobile.navigate("#cities-page");
  });
});

$(document).on('pageshow', '#tasks-page', function(){
  var category = localStorage.getItem('task-category');
  console.log(category);

  var list_tampalate = '<div class="ui-btn" task_id="%task_id%"><div class="input-item"><div class="task-list-title">%title%</div><div class="task-list-detail"><div class="task-list-zone">%zone%</div><div class="task-list-pay">%payment%</div><div class="task-list-pubtime">%publish_date%</div></div></div></div>';
  $('#task-list-view>.ui-controlgroup-controls').children().remove();
  requestData(URL.ALL_TASK, function(result) {
  var tasks = JSON.parse(result);
    console.log(tasks);
    for (var i = 0; i < tasks.length; i++) {
      list_tampalate = list_tampalate.replace('%task_id%', tasks[i].id).replace('%title%', tasks[i].title).replace('%payment%', tasks[i].payment).replace('%zone%', tasks[i].zone).replace('%publish_date%', tasks[i].publish_date);
      var list_item = $(list_tampalate);

      // task-detail-page click
      list_item.click(function() {
        var task_id = $(this).attr('task_id');
        localStorage.setItem('task-detail-id', task_id);
        $.mobile.navigate('#task-detail-page');
      });
      $('#task-list-view>.ui-controlgroup-controls').append(list_item);
    }
  });
});

/* 任务展示页 */
$(document).on('pageshow', '#server-info-page', function(){
  var category = localStorage.getItem('task-category');
  console.log(category);

  var list_tampalate = '<div class="ui-btn ui-first-child"><div class="input-item"><div class="server-avatar"></div><div class="server-info"><div class="server-name">%server-name%</div><div class="server-zone">%server-zone%</div><div class="row1"><span>好评率:<span>%server-good-rate%</span></span><span>按时完成率:<span>%server-compelete-rate%</span></span></div><div class="row2"><span>等级:<span>%server-rank%</span></span><span>完成任务数:<span>%server-tasks-number%</span></span></div></div></div></div>';
  $('#server-list-view>.ui-controlgroup-controls').children().remove();
  requestData(URL.SERVERS, function(result) {
    var servers = JSON.parse(result);
    console.log(tasks);
    for (var i = 0; i < tasks.length; i++) {
      list_tampalate = list_tampalate.replace('%task_id%', servers[i].id).replace('%title%', servers[i].title).replace('%payment%', servers[i].payment).replace('%zone%', servers[i].zone).replace('%publish_date%', servers[i].publish_date);
      var list_item = $(list_tampalate);

      // task-detail-page click
      list_item.click(function() {
        var task_id = $(this).attr('task_id');
        localStorage.setItem('task-detail-id', task_id);
        $.mobile.navigate('#task-detail-page');
      });
      $('#server-list-view>.ui-controlgroup-controls').append(list_item);
    }
  });
});

/* 任务展示页 */
$(document).on('pageshow', '#task-detail-page', function(){
  var task_id = localStorage.getItem('task-detail-id');
  console.log(task_id);

  requestData(URL.GET_TASK_DETAIL, function(result) {
    var task = JSON.parse(result);
    console.log(task);
    for (var i in task) {
      var id = 'detail-' + i;
      var elem = $('#' + id);
      if (elem.length > 0) {
        elem.next().children().eq(0).val(task[i]);
      }
    }
  });
});

/* 服务方信息 */
$(document).on('pageshow', '#server-info-page', function(){
  var task_id = localStorage.getItem('task-detail-id');
  console.log(task_id);

//  var list_tampalate = '<div class="ui-btn"><div class="input-item">
//      <div class="server-avatar"></div>
//    <div class="server-info">
//      <div class="server-name">%server-name%</div>
//      <div class="server-zone">%server-zone%</div>
//      <div class="row1"><span>好评率:</span><span class=""></span><span>按时完成率:</span><span class=""></span></div>
//      <div class="row2"><span>等级:</span><span>完成任务数:</span></div>
//    </div>
//  </div></div>';
  $('#server-list-view>.ui-controlgroup-controls').children().remove();
  requestData(URL.SERVERS, function(result) {
    var servers = JSON.parse(result);
    console.log(tasks);
    for (var i = 0; i < tasks.length; i++) {
      list_tampalate = list_tampalate.replace('%task_id%', servers[i].id).replace('%title%', servers[i].title).replace('%payment%', servers[i].payment).replace('%zone%', servers[i].zone).replace('%publish_date%', servers[i].publish_date);
      var list_item = $(list_tampalate);

      // task-detail-page click
      list_item.click(function() {
        var task_id = $(this).attr('task_id');
        localStorage.setItem('task-detail-id', task_id);
        $.mobile.navigate('#task-detail-page');
      });
      $('#server-list-view>.ui-controlgroup-controls').append(list_item);
    }
  });
});

$(document).on('pageshow', '#task-detail-page', function(){
  var task_id = localStorage.getItem('task-detail-id');
  console.log(task_id);

  requestData(URL.GET_TASK_DETAIL, function(result) {
    var task = JSON.parse(result);
    console.log(task);
    for (var i in task) {
      var id = 'detail-' + i;
      var elem = $('#' + id);
      if (elem.length > 0) {
        elem.next().children().eq(0).val(task[i]);
      }
    }
  });
});

$(document).on('pagecreate', '#message-list-page', function(){
  var page = $( this );

  $( ".message-list-title" ).on( "click", function() {
    //page.find( ".jqm-navmenu-panel:not(.jqm-panel-page-nav)" ).panel( "open" );
    $.mobile.navigate("#message-page");
  });
});

URL = {
  ALL_TASK: 'all_tasks.json',
  GET_TASK_DETAIL: 'task_detail.json',
  SERVERS: 'servers.json'
};

var requestData = function(url, cb, onerror) {
  $.get(url, function(result) {
    cb(result);
  });
}