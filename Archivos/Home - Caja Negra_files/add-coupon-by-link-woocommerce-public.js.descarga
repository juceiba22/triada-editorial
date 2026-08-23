(function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

	var coupon_events = {
		init: function() {
			coupon_events.payment_method_change();
			coupon_events.email_change();
		},
		payment_method_change: function() {
			jQuery('body').on('change', 'input[name="payment_method"]', function () {
				coupon_events.cartReload();
			});
		},
		email_change: function() {
			jQuery('body').on('change', 'input[name="billing_email"]', function () {
				coupon_events.cartReload();
			});
		},
		cartReload: function() {
			jQuery('body').trigger('update_checkout');
		}
	};

	$(function($) {
		coupon_events.init();
	});

})( jQuery );
