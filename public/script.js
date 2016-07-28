/**
 * @file
 *
 */
(function($, Quill) {

  'use strict';

  $(function() {

    $('.item-row').each(function() {
      let $this = $(this);
      let $editor = $this.find('.value');
      let $toolbar = $this.find('.toolbar');

      if (!$editor.prop('id')) {
        // Make sure we can find the ID attribute of the DIV.
        return;
      }

      // Build an instance of the Quill editor and assign to data so we can
      // access the instance later.
      $editor.data('editor', new Quill('#' + $editor.prop('id'), {theme: 'snow'}));

      if ($toolbar.prop('id')) {
        $editor.data('editor').addModule('toolbar', { container: '#' + $toolbar.prop('id') });
      }
    });

    $('.btn-download').on('click', function() {
      let data = [];
      // Reconstruct the data object so we can push it to a CSV.
      $('.item').each(function() {
        let item = {};
        $(this).find('.item-row').each(function() {
          let $title = $(this).find('.lead');
          let $value = $(this).find('.value');

          item[$title.text()] = $value.data('editor').getModule('toolbar')
            ? $value.data('editor').getHTML().replace(/(<div>)/g, '<p>').replace(/(<\/div>)/g, '</p>')
            : $value.data('editor').getText().trim();
        });
        data.push(item);
      });

      $('form[name=download]').find('[name=data]').val(JSON.stringify(data)).end().submit();
    });

  });

})(jQuery, Quill);
