(function($) { 
"use strict";
	$(document).ready(function ($) {
		var custom_styles = "";
		
		function skillsStyles() {
			$( '.skill-container' ).each( function() {
				var value = $(this).attr('data-value');

				if( typeof value != 'undefined' ) {
					var id = $(this).attr('id'),
					$custom_style = '#' + id + ' .skill-percentage { width: ' + value + '%; } ';
					custom_styles += $custom_style;
				}
			});
			$('head').append('<style data-styles="aveo-theme-skills-css" type="text/css">' + custom_styles  + '</style>');
		}

		skillsStyles();

		$(this).ajaxComplete(function() {
			$('style[data-styles="aveo-theme-skills-css"]').remove().detach();
			skillsStyles();
		});
	});
})(jQuery);
