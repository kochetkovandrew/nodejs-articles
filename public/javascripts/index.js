jQuery(function() {
  $('#articles_index').DataTable();
  $('.trumbowyg').trumbowyg({svgPath: false, btns: [
      ['undo', 'redo', 'strong', 'em', 'del'],
      ['superscript', 'subscript', 'unorderedList', 'orderedList', 'removeformat']
    ]
  });
  // handling delete links – using DELETE HTTP request
  $('a[data-method="delete"]').click(function(event) {
    event.preventDefault();
    $.ajax({
      url: $(this).attr('href'),
      method: 'DELETE'
    }).done(function(data) {
      location.reload(true);
    });
  })
});
