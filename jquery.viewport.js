/*
 * Viewport - jQuery plugin adding selectors and events for finding and handling elements in viewport
 *
 * Copyright (c) 2014 Anton Zinoviev (xobotyi)
 *
 * Licensed: not licensed
 *
 * Project home: homeless
 * */
(function( $ ) {
	var methods = {
		aboveTheViewport: function( meta ) {
			var _scrollable = $( this ).closest( ':have-scroll' );
			var _treshold = typeof meta[3] == 'string' ? parseInt( meta[3], 10 ) : 0;
			var _fromTop = _scrollable.get( 0 ).tagName == "BODY" ? $( this ).offset().top : $( this ).position().top;
			var _marginTop = parseInt( $( this ).css( 'margin-top' ), 10 );
			var _marginBottom = parseInt( $( this ).css( 'margin-top' ), 10 );

			return _fromTop + _marginTop - _marginBottom + _treshold < 0;
		},
		belowTheViewport: function( meta ) {
			var _scrollable = $( this ).closest( ':have-scroll' );
			var _treshold = typeof meta[3] == 'string' ? parseInt( meta[3], 10 ) : 0;
			var _bottomBorder = _scrollable.get( 0 ).tagName == "BODY" ? $( window ).height() : _scrollable.height();
			var _fromTop = _scrollable.get( 0 ).tagName == "BODY" ? $( this ).offset().top + $( this ).height() : $( this ).position().top + $( this ).height();
			var _marginTop = parseInt( $( this ).css( 'margin-top' ), 10 );
			var _marginBottom = parseInt( $( this ).css( 'margin-top' ), 10 );

			return _bottomBorder <= _fromTop + _marginTop - _marginBottom - _treshold;
		},
		leftOfViewport: function( meta ) {
			var _scrollable = $( this ).closest( ':have-scroll' );
			var _treshold = typeof meta[3] == 'string' ? parseInt( meta[3], 10 ) : 0;
			var _fromLeft = _scrollable.get( 0 ).tagName == "BODY" ? $( this ).offset().left : $( this ).position().left;
			var _marginLeft = parseInt( $( this ).css( 'margin-left' ), 10 );
			var _marginRight = parseInt( $( this ).css( 'margin-right' ), 10 );

			return _fromLeft + _marginLeft - _marginRight + _treshold < 0;
		},
		rightOfViewport: function( meta ) {
			var _scrollable = $( this ).closest( ':have-scroll' );
			var _treshold = typeof meta[3] == 'string' ? parseInt( meta[3], 10 ) : 0;
			var _rightBorder = _scrollable.get( 0 ).tagName == "BODY" ? $( window ).width() : _scrollable.width();
			var _fromLeft = _scrollable.get( 0 ).tagName == "BODY" ? $( this ).offset().left + $( this ).width() : $( this ).position().left + $( this ).width();
			var _marginLeft = parseInt( $( this ).css( 'margin-left' ), 10 );
			var _marginRight = parseInt( $( this ).css( 'margin-right' ), 10 );

			return _rightBorder <= _fromLeft + _marginLeft - _marginRight - _treshold;
		},
		inViewport: function( meta ) {
			return !methods['aboveTheViewport'].call( this, meta )
				&& !methods['belowTheViewport'].call( this, meta )
				&& !methods['leftOfViewport'].call( this, meta )
				&& !methods['rightOfViewport'].call( this, meta );
		},
		haveScroll: function() {
			return this.scrollHeight > $( this ).height();
		}
	};

	$.extend( $.expr[':'], {
		"above-the-viewport": function( obj, index, meta ) {
			return methods['aboveTheViewport'].call( obj, meta );
		},
		"below-the-viewport": function( obj, index, meta ) {
			return methods['belowTheViewport'].call( obj, meta );
		},
		"left-of-viewport": function( obj, index, meta ) {
			return methods['leftOfViewport'].call( obj, meta );
		},
		"right-of-viewport": function( obj, index, meta ) {
			return methods['rightOfViewport'].call( obj, meta );
		},
		"in-viewport": function( obj, index, meta ) {
			return methods['inViewport'].call( obj, meta );
		},
		"have-scroll": function( obj, index, meta ) {
			return methods['haveScroll'].call( obj, meta );
		}
	} );

	$.fn.appearInViewport = function( callBack, options ) {
		if( typeof callBack == 'string' && callBack == '' ) {

		} else if( typeof callBack != 'function' ) {
			$.error( 'Callback function not defined' );
			return this;
		}

		var settings = $.extend( {
			"treshold": 1,
			"noPartly": false,
			"accuratePositioning": true,
			"scrollWidth": [ 17, 17 ]
		}, options );

		return this.each( function() {
			var $this = this;

			if( $( $this ).is( ':in-viewport(' + settings.treshold + ')' ) ) {
				callBack.apply( $this, [ 'inside' ] );
			} else if( !$( $this ).is( ':in-viewport(' + settings.treshold + ')' ) ) {
				callBack.apply( $this, [ 'outside' ] );
			}

			var scrollable = $( $this ).closest( ':have-scroll' );
			if( scrollable.get( 0 ).tagName == "BODY" ) {
				$( window ).bind( "scroll.viewport", function() {
					if( $( $this ).is( ':in-viewport(' + settings.treshold + ')' ) ) {
						callBack.apply( $this, [ 'inside' ] );
					} else if( !$( $this ).is( ':in-viewport(' + settings.treshold + ')' ) ) {
						callBack.apply( $this, [ 'outside' ] );
					}
				} );
			} else {
				scrollable.bind( "scroll.viewport", function() {
					if( $( $this ).is( ':in-viewport(' + settings.treshold + ')' ) ) {
						callBack.apply( $this, [ 'inside' ] );
					} else if( !$( $this ).is( ':in-viewport(' + settings.treshold + ')' ) ) {
						callBack.apply( $this, [ 'outside' ] );
					}
				} );
			}
		} );
	};
})( jQuery );