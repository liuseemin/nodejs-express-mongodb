$(document).ready( function() {
  $('.deluser').click( function() {
    console.log(this.id);
    var parameters = {
      id: this.id,
      action: 'delete'
    };
    $.get('/manage', parameters, function(data) {
      console.log(data);
      $('#data' + data).remove();
    });
  });
});