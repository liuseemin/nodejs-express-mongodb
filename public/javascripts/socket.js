var socket = io.connect();

socket.emit('login', {username: username});

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
      var content = '<nav class="navbar navbar-default"><div class="container-fluid"><a class="navbar-brand">@' + data.userlist[this.id] + ':</a><form class="navbar-form" id="msgto' + data.userlist[this.id] + '"><div class="form-group" style="display:inline;"><input type="text" class="form-control" placeholder="Enter Message..."></div><button type="button" class="btn btn-default">Send</button></form></div></nav>';

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
          $('div#talkto' + data.userlist[target]).append("<div>" + username + ": " + message + "</div>");
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
  $('div#talkto' + data.from).append("<div>" + data.from + ": " + data.msg + "</div>");
});

$(document).ready( function () {
  $('#logout').click( function() {
    socket.emit('logout', {});
  });

  $('#tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  /*$(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
*/
});