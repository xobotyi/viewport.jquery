/*
 * Viewport - jQuery plugin adding selectors and events for finding and handling elements in viewport
 *
 * Copyright (c) 2014 Anton Zinoviev (xobotyi)
 *
 * Licensed: MIT License (MIT)
 *
 * Project home: homeless
 * */
(function( $ ) {
	var methods = {
		aboveTheViewport: function( treshold ) {
			var _scrollable = $( this ).closest( ':have-scroll' );
			var _treshold = typeof treshold == 'string' ? parseInt( treshold, 10 ) : 0;
			var _fromTop = _scrollable.get( 0 ).tagName == "BODY" ? $( this ).offset().top : $( this ).position().top;
			var _marginTop = parseInt( $( this ).css( 'margin-top' ), 10 );
			var _marginBottom = parseInt( $( this ).css( 'margin-top' ), 10 );

			return _fromTop + _marginTop - _marginBottom + _treshold < 0;
		},
		belowTheViewport: function( treshold ) {
			var _scrollable = $( this ).closest( ':have-scroll' );
			var _treshold = typeof treshold == 'string' ? parseInt( treshold, 10 ) : 0;
			var _bottomBorder = _scrollable.get( 0 ).tagName == "BODY" ? $( window ).height() : _scrollable.height();
			var _fromTop = _scrollable.get( 0 ).tagName == "BODY" ? $( this ).offset().top + $( this ).height() : $( this ).position().top + $( this ).height();
			var _marginTop = parseInt( $( this ).css( 'margin-top' ), 10 );
			var _marginBottom = parseInt( $( this ).css( 'margin-top' ), 10 );

			return _bottomBorder <= _fromTop + _marginTop - _marginBottom - _treshold;
		},
		leftOfViewport: function( treshold ) {
			var _scrollable = $( this ).closest( ':have-scroll' );
			var _treshold = typeof treshold == 'string' ? parseInt( treshold, 10 ) : 0;
			var _fromLeft = _scrollable.get( 0 ).tagName == "BODY" ? $( this ).offset().left : $( this ).position().left;
			var _marginLeft = parseInt( $( this ).css( 'margin-left' ), 10 );
			var _marginRight = parseInt( $( this ).css( 'margin-right' ), 10 );

			return _fromLeft + _marginLeft - _marginRight + _treshold < 0;
		},
		rightOfViewport: function( treshold ) {
			var _scrollable = $( this ).closest( ':have-scroll' );
			var _treshold = typeof treshold == 'string' ? parseInt( treshold, 10 ) : 0;
			var _rightBorder = _scrollable.get( 0 ).tagName == "BODY" ? $( window ).width() : _scrollable.width();
			var _fromLeft = _scrollable.get( 0 ).tagName == "BODY" ? $( this ).offset().left + $( this ).width() : $( this ).position().left + $( this ).width();
			var _marginLeft = parseInt( $( this ).css( 'margin-left' ), 10 );
			var _marginRight = parseInt( $( this ).css( 'margin-right' ), 10 );

			return _rightBorder <= _fromLeft + _marginLeft - _marginRight - _treshold;
		},
		inViewport: function( treshold ) {
			return !methods['aboveTheViewport'].call( this, treshold )
				&& !methods['belowTheViewport'].call( this, treshold )
				&& !methods['leftOfViewport'].call( this, treshold )
				&& !methods['rightOfViewport'].call( this, treshold );
		},
		getPosition: function( treshold, mixed ) {
			var _above = methods['aboveTheViewport'].call( this, treshold );
			var _below = methods['belowTheViewport'].call( this, treshold );
			var _left = methods['leftOfViewport'].call( this, treshold );
			var _right = methods['rightOfViewport'].call( this, treshold );
			var state = null;

			if( !_above && !_below && !_left && !_right ) {
				state = 'inside';
			} else if( _above && !_below ) {
				if( mixed && ( _left || _right ) ) {
					state = _left ? 'above-left' : 'above-right';
				} else {
					state = 'above';
				}
			} else if( _below && !_above ) {
				if( mixed && ( _left || _right ) ) {
					state = _left ? 'below-left' : 'below-right';
				} else {
					state = 'below';
				}
			} else if( _left && !_above && !_below && !_right ) {
				state = 'left';
			} else if( _right && !_above && !_below && !_left ) {
				state = 'right';
			} else {
				state = 'outside';
			}

			return state;
		},
		haveScroll: function() {
			return this.scrollHeight > $( this ).height();
		}
	};

	$.extend( $.expr[':'], {
		"above-the-viewport": function( obj, index, meta ) {
			return methods['aboveTheViewport'].call( obj, meta[3] );
		},
		"below-the-viewport": function( obj, index, meta ) {
			return methods['belowTheViewport'].call( obj, meta[3] );
		},
		"left-of-viewport": function( obj, index, meta ) {
			return methods['leftOfViewport'].call( obj, meta[3] );
		},
		"right-of-viewport": function( obj, index, meta ) {
			return methods['rightOfViewport'].call( obj, meta[3] );
		},
		"in-viewport": function( obj, index, meta ) {
			return methods['inViewport'].call( obj, meta[3] );
		},
		"have-scroll": function( obj ) {
			return methods['haveScroll'].call( obj );
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
			"allowPartly": true,
			"allowMixedStates": true,
			"scrollWidth": [ 17, 17 ]
		}, options );

		return this.each( function() {
			var $this = this;

			callBack.apply( $this, [ methods['getPosition'].call( this, settings.treshold, settings.allowMixedStates ) ] );

			var scrollable = $( $this ).closest( ':have-scroll' );
			if( scrollable.get( 0 ).tagName == "BODY" ) {
				$( window ).bind( "scroll.viewport", function() {
					callBack.apply( $this, [ methods['getPosition'].call( $this, settings.treshold, settings.allowMixedStates ) ] );
				} );
			} else {
				scrollable.bind( "scroll.viewport", function() {
					callBack.apply( $this, [ methods['getPosition'].call( $this, settings.treshold, settings.allowMixedStates ) ] );
				} );
			}
		} );
	};
})( jQuery );