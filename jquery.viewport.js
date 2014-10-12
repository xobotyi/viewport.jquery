/*
 * viewport - jQuery plugin for elements positioning in viewport
 * (c) Copyright 2014, Anton Zinoviev aka xobotyi
 * Released under the MIT license
 */
(function( $ ) {
	var methods = {
		getElementPosition: function() {
			var _scrollableParent = $( this ).parents( ':have-scroll' );

			if( !_scrollableParent.length ) {
				return false;
			}

			var _topBorder = methods['getFromTop'].call( this ) - _scrollableParent.scrollTop();
			var _leftBorder = methods['getFromLeft'].call( this ) - _scrollableParent.scrollLeft();

			return {
				"elemTopBorder": _topBorder,
				"elemBottomBorder": _topBorder + $( this ).height(),
				"elemLeftBorder": _leftBorder,
				"elemRightBorder": _leftBorder + $( this ).width(),
				"viewport": _scrollableParent,
				"viewportHeight": _scrollableParent.height(),
				"viewportWidth": _scrollableParent.width()
			};
		},
		getFromTop: function() {
			var fromTop = 0;

			for( var obj = $( this ).get( 0 ); obj && !$( obj ).is( ':have-scroll' ); obj = obj.offsetParent ) {
				fromTop += obj.offsetTop;
			}

			return Math.round( fromTop );
		},
		getFromLeft: function() {
			var fromLeft = 0;

			for( var obj = $( this ).get( 0 ); obj && !$( obj ).is( ':have-scroll' ); obj = obj.offsetParent ) {
				fromLeft += obj.offsetLeft;
			}

			return Math.round( fromLeft );
		},
		aboveTheViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.elemTopBorder - _threshold < 0 : false;
		},
		partlyAboveTheViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.elemTopBorder - _threshold < 0
				&& pos.elemBottomBorder - _threshold >= 0 : false;
		},
		belowTheViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.viewportHeight < pos.elemBottomBorder + _threshold : false;
		},
		partlyBelowTheViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.viewportHeight < pos.elemBottomBorder + _threshold
				&& pos.viewportHeight > pos.elemTopBorder + _threshold : false;
		},
		leftOfViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.elemLeftBorder - _threshold <= 0 : false;
		},
		partlyLeftOfViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.elemLeftBorder - _threshold < 0
				&& pos.elemRightBorder - _threshold >= 0 : false;
		},
		rightOfViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.viewportWidth < pos.elemRightBorder + _threshold : false;
		},
		partlyRightOfViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? pos.viewportWidth < pos.elemRightBorder + _threshold
				&& pos.viewportWidth > pos.elemLeftBorder + _threshold : false;
		},
		inViewport: function( threshold ) {
			var _threshold = typeof threshold == 'string' ? parseInt( threshold, 10 ) : 0;

			var pos = methods['getElementPosition'].call( this );

			return pos ? !( pos.elemTopBorder - _threshold < 0 )
				&& !( pos.viewportHeight < pos.elemBottomBorder + _threshold )
				&& !( pos.elemLeftBorder - _threshold < 0 )
				&& !( pos.viewportWidth < pos.elemRightBorder + _threshold ) : true;
		},
		getState: function( options ) {
			var settings = $.extend( {
				"threshold": 0,
				"allowPartly": false,
				"allowMixedStates": false
			}, options );

			var pos = methods['getElementPosition'].call( this );

			if( !pos ){
				return 'inside';
			}

			var _above = pos.elemTopBorder - settings.threshold < 0;
			var _below = pos.viewportHeight < pos.elemBottomBorder + settings.threshold;
			var _left = pos.elemLeftBorder - settings.threshold < 0;
			var _right = pos.viewportWidth < pos.elemRightBorder + settings.threshold;
			var state = '';

			if( !_above && !_below && !_left && !_right ) {
				state = 'inside';
			} else {
				if( settings.allowPartly ) {
					var _partlyAbove = pos.elemTopBorder - settings.threshold < 0 && pos.elemBottomBorder - settings.threshold >= 0;
					var _partlyBelow = pos.viewportHeight < pos.elemBottomBorder + settings.threshold && pos.viewportHeight > pos.elemTopBorder + settings.threshold;
					var _partlyLeft = pos.elemLeftBorder - settings.threshold < 0 && pos.elemRightBorder - settings.threshold >= 0;
					var _partlyRight = pos.viewportWidth < pos.elemRightBorder + settings.threshold && pos.viewportWidth > pos.elemLeftBorder + settings.threshold;

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
			return this.scrollHeight > this.offsetHeight
				|| this.scrollWidth > this.offsetWidth;
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

	$.fn.viewportTrack = function( callBack, options ) {
		var settings = $.extend( {
			"threshold": 0,
			"allowPartly": false,
			"allowMixedStates": false
		}, options );

		if( typeof callBack == 'string' && callBack == 'destroy' ) {
			return this.each( function() {
				var $this = this;
				var _scrollable = $( $this ).parent( ':have-scroll' );

				if( !_scrollable.length || typeof $( this ).data( 'euid' ) == 'undefined' ) {
					return true;
				}

				if( _scrollable.get( 0 ).tagName == "BODY" ) {
					$( window ).unbind( ".viewport" + $( this ).data( 'euid' ) );
					$( this ).removeData( 'euid' );
				} else {
					_scrollable.unbind( ".viewport" + $( this ).data( 'euid' ) );
					$( this ).removeData( 'euid' );
				}
			} );
		} else if( typeof callBack != 'function' ) {
			$.error( 'Callback function not defined' );
			return this;
		}

		return this.each( function() {
			var $this = this;

			if( typeof $( this ).data( 'euid' ) == 'undefined' )
				$( this ).data( 'euid', methods['generateEUID'].call() );

			callBack.apply( $this, [ methods['getState'].apply( $this, [ settings ] ) ] );

			var _scrollable = $( $this ).parents( ':have-scroll' );

			if( !_scrollable.length ) {
				callBack.apply( $this, 'inside' );
				return true;
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