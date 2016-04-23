var $ = require('jquery');
var Instructions = require('./instructions');
var inputs = require('./data/inputs.json');

/**
 * Renders and controls a widget that allows users to get installation
 * and basic use instructions based on the operating system, webserver,
 * and use case.
 */
InstructionWidget = (function() {

  var container;

  init = function() {
    container = $('.instruction-widget');
    render();
    bind_ui_actions();
    set_state_from_url();
    Instructions().render(get_input());
  }

  get_input = function() {
    var os_select = $('#os-select');
    var os = os_select.val()
    var distro = os_select.find('option:selected').data('distro');
    var version = os_select.find('option:selected').data('version');

    var webserver = $("#server-select").val();

    return {
      os: os,
      distro: distro,
      version: version,
      webserver: webserver
    }
  };

  set_state_from_url = function() {
    var query = window.location.search.substring(1);
    var params = parse_query_string(query);
    if (params.server != null && params.os != null) {
      $('#server-select').val(params.server);
      $('#os-select').val(params.os);
    }
  }

  parse_query_string = function(query) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function(s) {
          return decodeURIComponent(s.replace(pl, " "));
        };

    var urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
  }

  render = function() {
    var template = require('./templates/widget.html');
    var rendered = template.render({
      operating_systems: inputs.operating_systems,
      webservers: inputs.webservers
    });
    container.html(rendered);
  };

  toggle_tabs = function() {
    $('.instruction-pane').toggle();
  };

  bind_ui_actions = function() {
    container.on("click", ".tab", function() {
      toggle_tabs();
    });

    container.on("change", function() {
      var input = get_input();
      Instructions().render(input);
    });
  };

  return {
    init: init
  }
})();

$('document').ready(function() {
  InstructionWidget.init();
});
