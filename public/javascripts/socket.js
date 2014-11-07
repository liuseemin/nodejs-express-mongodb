var socket = io.connect();

socket.emit('login', {username: username});
var msgpool = [];

function hashCodeGenerator(Hashpool, num) {
  var code = '';
  while(code.length < num) {
    for (var i = 0; i < num; i++) {
      var rand = Math.ceil(Math.random() * 72 % 36) + 47;
      var charcode;
      if (rand <= 57)
        charcode = String.fromCharCode(rand);
      else
        charcode = String.fromCharCode(rand + 7);
      code = code + charcode;
    }
    if (Hashpool.indexOf(code) != -1) code = '';
  }
  Hashpool.push(code);
  return code;
}

function createMsgDiv(targetid, name, msg, time, self) {
  var msgHash = hashCodeGenerator(msgpool, 10);
  $("<div class='msgDiv' id='msg" + msgHash + "' style='display:none;'><div class='msg_head col-xs-2' style='text-align:right;'>" + name + "</div><div class='msg_content col-xs-9'>" + msg + "</div><div class='msg_time col-xs-1'>" + time + "</div></div>").insertAfter(targetid + ' .startline');
  if (self) $('#msg' + msgHash).addClass('self');
  $('#msg' + msgHash).slideDown();
}

socket.on('updateUsers', function (data) {
  console.log(data.userlist);
  userlist = data.userlist;
  $('#users_online').empty();
  for (var id in data.userlist) {
  	$('#users_online').append("<a id='" + id + "' class='list-group-item talkto'>" + data.userlist[id] + "</a>");
  }
  $('.talkto').click( function() {
    if ($('#tabs.nav>li>a[href="#talkto' + data.userlist[this.id] + '"]').length == 0) {
      
      $('#tabs.nav').append("<li><a href='#talkto" + data.userlist[this.id] + "' data-toggle='tab'><span class='badge'>0</span> Chat: " + data.userlist[this.id] + " <button type='button' class='close' style='padding-left: 5px;'>&times;</button></a></li>");
      $('#tabcontent.tab-content').append("<div id='talkto" + data.userlist[this.id] + "' class='tab-pane fade'></div>");
      $('#tabs.nav>li>a[href="#talkto' + data.userlist[this.id] + '"]>.close').click( function() {
        $('#tabs.nav>li>a[href="#home"]').tab('show');
        $('div#home').addClass('in active');
        var selector = $(this).parent().attr('href');
        $('div' + selector).remove();
        $(this).parentsUntil('#tabs').remove();
      });
      var content = '<nav class="navbar navbar-default"><div class="container-fluid"><a class="navbar-brand">@' + data.userlist[this.id] + ':</a><form class="navbar-form" id="msgto' + data.userlist[this.id] + '"><div class="form-group" style="display:inline;"><input type="text" class="form-control" placeholder="Enter Message..."></div><button type="button" class="btn btn-default">Send</button></form></div></nav><div class="msgBox"><div class="startline" style="display:none"></div></div>';

      $('div#talkto' + data.userlist[this.id]).html(content);
      $("#tabs a[href='#talkto" + data.userlist[this.id] + "']").click( function (e) {
        e.preventDefault();
        $(this).tab('show');
        $(this).children('.badge').html(0);
      });
      var target = this.id;
      $('div#talkto' + data.userlist[this.id] + ' button').click( function () {
        var message = $('div#talkto' + data.userlist[target] + ' input').val();
        if (message.length > 0) {
          $('div#talkto' + data.userlist[target] + ' input').val('');
          socket.emit('talkto', {id: target, msg: message});
          
          var date = new Date();
          var sendtime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          createMsgDiv('div#talkto' + data.userlist[target] + ' .msgBox', username, message, sendtime, true);
        }
      });
      $('#msgto' + data.userlist[this.id]).submit( function (e) {
        $('div#talkto' + data.userlist[target] + ' button').click();
        e.preventDefault();
      });
    }
  });
});

socket.on('incomeMsg', function (data) {
  //console.log(data.from + ": " + data.msg);
  if ($('#tabs.nav>li>a[href="#talkto' + data.from + '"]').length == 0) $('.talkto#' + data.from_id).click();
  if ($('div#talkto' + data.from).hasClass('active') == false) {

    $('#noticesound')[0].load();
    $('#noticesound')[0].play();
    
    var msgc = parseInt($('#tabs.nav>li>a[href="#talkto' + data.from + '"]>.badge').html());
    $('#tabs.nav>li>a[href="#talkto' + data.from + '"]>.badge').html(++msgc);
    $('#notice #message').html(data.from + ': ' + data.msg);
    $('#notice').fadeIn();
    setTimeout(function(){$('#notice').fadeOut()}, 3000);
  }
  //$('div#talkto' + data.from + ' .msgBox').append("<div>" + data.from + ": " + data.msg + "</div>");
  createMsgDiv('div#talkto' + data.from + ' .msgBox', data.from, data.msg, data.time, false);
});

$(document).ready( function () {
  $('#logout').click( function() {
    socket.emit('logout', {});
  });

  $('#tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
});