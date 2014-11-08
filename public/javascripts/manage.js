$(document).ready( function() {
  $('.deluser').click( function() {
    var parameters = {
      id: $(this).id
    };
    $.get('/signup', parameters, function(data) {
      $('#list').empty();
      for (var u in data.userlist) {
        
      }
    }
  });
});