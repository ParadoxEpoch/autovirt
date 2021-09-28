(function(defaults, $) {
  "use strict";
  
  $.fn.simpleCheckboxTable = function(options) {
    var settings = $.extend({}, defaults, options);

    return this.each(function(i, elem) {
      var $table = $(elem);
      $table
        .find("thead th:nth-child(1) input[type='checkbox']")
          .on("change", function() {
            if ($(this).is(":checked")) {
              $table.find("tbody td:nth-child(1) input[type='checkbox']:not(:disabled):not(:checked)").prop("checked", true).trigger("change");
            } else {
              $table.find("tbody td:nth-child(1) input[type='checkbox']:not(:disabled):checked").prop("checked", false).trigger("change");
            }
          })
          .end()
        .find("tbody tr")
          .on("click", function() {
            var $checkbox = $(this).find("td:nth-child(1) input[type='checkbox']:not(:disabled)");
            $checkbox.prop("checked", !$checkbox.is(":checked")).trigger("change");
          })
          .end()
        .find("tbody td:nth-child(1) input[type='checkbox']")
          .on("change", function() {
            var $uncheckedCheckboxes = $(this).closest("tbody").find("td:nth-child(1) input[type='checkbox']:not(:disabled):not(:checked)"),
                isCheckedAll = $uncheckedCheckboxes.length === 0;

            $table.find("thead th:nth-child(1) input[type='checkbox']").prop("checked", isCheckedAll);

            settings.onCheckedStateChanged.call($table, $(this));
          })
          .trigger("change")
          .end()
        .find("tbody td a,input[type='checkbox']")
          .on("click", function(e) {
            e.stopPropagation();
          })
          .end();
    });
  };
})({
  onCheckedStateChanged: function() {},
}, jQuery);
