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
		getElementPosition: function() {
			var _scrollableParent = $( this ).parents( ':have-scroll' );

			if( !_scrollableParent.length ) {
				return false;
			}

			var _topBorder = _scrollableParent.get( 0 ).tagName == "BODY" ? $( this ).offset().top : $( this ).position().top;
			var _leftBorder = _scrollableParent.get( 0 ).tagName == "BODY" ? $( this ).offset().left : $( this ).position().left;

			return {
				"elemTopBorder": _topBorder,
				"elemBottomBorder": _topBorder + $( this ).height(),
				"elemLeftBorder": _leftBorder,
				"elemRightBorder": _leftBorder + $( this ).width(),
				"elemMargin": [
					parseInt( $( this ).css( 'margin-top' ), 10 ),
					parseInt( $( this ).css( 'margin-right' ), 10 ),
					parseInt( $( this ).css( 'margin-bottom' ), 10 ),
					parseInt( $( this ).css( 'margin-left' ), 10 )
				],
				"viewport": _scrollableParent,
				"viewportHeight": _scrollableParent.height(),
				"viewportWidth": _scrollableParent.width()
			};
		},
		aboveTheViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );


			return pos ? pos.elemTopBorder + pos.elemMargin[0] - pos.elemMargin[2] - _threshold < 0 : false;
		},
		partlyAboveTheViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.elemTopBorder + pos.elemMargin[0] - pos.elemMargin[2] - _threshold < 0
				&& pos.elemBottomBorder + pos.elemMargin[0] + pos.elemMargin[2] - _threshold >= 0 : false;
		},
		belowTheViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.viewportHeight <= pos.elemTopBorder + $( this ).height() + pos.elemMargin[0] - pos.elemMargin[2] + _threshold : false;
		},
		partlyBelowTheViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.viewportHeight <= pos.elemBottomBorder + pos.elemMargin[0] - pos.elemMargin[2] + _threshold
				&& pos.viewportHeight > pos.elemTopBorder + pos.elemMargin[0] - pos.elemMargin[2] - _threshold : false;
		},
		leftOfViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.elemLeftBorder + pos.elemMargin[3] - pos.elemMargin[1] - _threshold < 0 : false;
		},
		partlyLeftOfViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.elemLeftBorder + pos.elemMargin[3] - pos.elemMargin[1] - _threshold < 0
				&& pos.elemRightBorder + pos.elemMargin[3] - pos.elemMargin[1] + _threshold >= 0 : false;
		},
		rightOfViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.viewportWidth <= pos.elemRightBorder + pos.elemMargin[3] - pos.elemMargin[1] + _threshold : false;
		},
		partlyRightOfViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.viewportWidth <= pos.elemRightBorder + pos.elemMargin[3] - pos.elemMargin[1] + _threshold
				&& pos.viewportWidth > pos.elemLeftBorder + pos.elemMargin[3] - pos.elemMargin[1] - _threshold : false;
		},
		inViewport: function( threshold ) {
			return !methods['aboveTheViewport'].call( this, threshold )
				&& !methods['belowTheViewport'].call( this, threshold )
				&& !methods['leftOfViewport'].call( this, threshold )
				&& !methods['rightOfViewport'].call( this, threshold );
		},
		getState: function( options ) {
			var settings = $.extend( {
				"viewport": false,
				"allowPartly": true,
				"allowMixedStates": true
			}, options );

			var _above = methods['aboveTheViewport'].call( this, settings.viewport );
			var _below = methods['belowTheViewport'].call( this, settings.viewport );
			var _left = methods['leftOfViewport'].call( this, settings.viewport );
			var _right = methods['rightOfViewport'].call( this, settings.viewport );
			var state = '';

			if( !_above && !_below && !_left && !_right ) {
				state = 'inside';
			} else {
				if( settings.allowPartly ) {
					var _partlyAbove = methods['partlyAboveTheViewport'].call( this, settings.viewport );
					var _partlyBelow = methods['partlyBelowTheViewport'].call( this, settings.viewport );
					var _partlyLeft = methods['partlyLeftOfViewport'].call( this, settings.viewport );
					var _partlyRight = methods['partlyRightOfViewport'].call( this, settings.threshold );

					if( _partlyAbove && !_partlyBelow ) {
						if( settings.allowMixedStates && ( _partlyLeft || _partlyRight ) ) {
							state = _partlyLeft ? 'partly-above partly-left' : 'partly-above partly-right';
						} else if( settings.allowMixedStates && ( _left || _right ) ) {
							state = _left ? 'left partly-above' : 'right partly-above';
						} else {
							state = 'partly-above';
						}
					} else if( _partlyBelow && !_partlyAbove ) {
						if( settings.allowMixedStates && ( _partlyLeft || _partlyRight ) ) {
							state = _partlyLeft ? 'partly-below partly-left' : 'partly-below partly-right';
						} else if( settings.allowMixedStates && ( _left || _right ) ) {
							state = _left ? 'left partly-below' : 'right partly-below';
						} else {
							state = 'partly-below';
						}
					} else if( _partlyLeft && !_partlyAbove && !_partlyBelow && !_partlyRight ) {
						if( settings.allowMixedStates && ( _above || _below ) ) {
							state = _above ? 'above partly-left' : 'below partly-left';
						} else {
							state = 'partly-left';
						}
					} else if( _partlyRight && !_partlyAbove && !_partlyBelow && !_partlyLeft ) {
						if( settings.allowMixedStates && ( _above || _below ) ) {
							state = _above ? 'above partly-right' : 'below partly-right';
						} else {
							state = 'partly-right';
						}
					}
				}
				if( state == '' ) {
					if( _above && !_below ) {
						if( settings.allowMixedStates && ( _left || _right ) ) {
							state = _left ? 'above-left' : 'above-right';
						} else {
							state = 'above';
						}
					} else if( _below && !_above ) {
						if( settings.allowMixedStates && ( _left || _right ) ) {
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
				}
			}

			return state;
		},
		haveScroll: function() {
			return this.scrollHeight > $( this ).height()
				|| this.scrollWidth > $( this ).width();
		},
		generateEUID: function() {
			var result = "";
			for( var i = 0; i < 32; i++ ) {
				result += Math.floor( Math.random() * 16 ).toString( 16 );
			}

			return result;
		}
	};

	$.extend( $.expr[':'], {
		"in-viewport": function( obj, index, meta ) {
			return methods['inViewport'].call( obj, meta[3] );
		},
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
		"partly-above-the-viewport": function( obj, index, meta ) {
			return methods['partlyAboveTheViewport'].call( obj, meta[3] );
		},
		"partly-below-the-viewport": function( obj, index, meta ) {
			return methods['partlyBelowTheViewport'].call( obj, meta[3] );
		},
		"partly-left-of-viewport": function( obj, index, meta ) {
			return methods['partlyLeftOfViewport'].call( obj, meta[3] );
		},
		"partly-right-of-viewport": function( obj, index, meta ) {
			return methods['partlyRightOfViewport'].call( obj, meta[3] );
		},
		"have-scroll": function( obj ) {
			return methods['haveScroll'].call( obj );
		}
	} );

	$.fn.appearInViewport = function( callBack, options ) {
		var settings = $.extend( {
			"viewport": false,
			"allowPartly": true,
			"allowMixedStates": true
		}, options );

		if( typeof callBack == 'string' && callBack == 'destroy' ) {
			return this.each( function() {
				var $this = this;
				var _scrollable = $( $this ).parent( ':have-scroll' );

				if( _scrollable.get( 0 ).tagName == "BODY" ) {
					$( window ).unbind( ".viewport" + $( this ).data( 'euid' ) );
				} else {
					_scrollable.unbind( ".viewport" + $( this ).data( 'euid' ) );
				}
			} );
		} else if( typeof callBack != 'function' ) {
			$.error( 'Callback function not defined' );
			return this;
		}

		return this.each( function() {
			var $this = this;
			$( this ).data( 'euid', methods['generateEUID'].call() );

			callBack.apply( $this, [ methods['getState'].apply( $this, [ settings ] ) ] );

			var _scrollable = $( $this ).parent( ':have-scroll' );

			if( !_scrollable.length ) {
				return false;
			}

			if( _scrollable.get( 0 ).tagName == "BODY" ) {
				$( window ).bind( "scroll.viewport" + $( this ).data( 'euid' ), function() {
					callBack.apply( $this, [ methods['getState'].apply( $this, [ settings ] ) ] );
				} );
			} else {
				_scrollable.bind( "scroll.viewport" + $( this ).data( 'euid' ), function() {
					callBack.apply( $this, [ methods['getState'].apply( $this, [ settings ] ) ] );
				} );
			}
		} );
	};
})( jQuery );