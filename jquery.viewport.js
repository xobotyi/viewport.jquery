/*
 * viewport - jQuery plugin for elements positioning in viewport
 * ver.: 0.1.0
 * (c) Copyright 2014, Anton Zinoviev aka xobotyi
 * Released under the MIT license
 */
(function( $ ) {
	var methods = {
		getElementPosition: function() {
			var $this = $( this );
			var _scrollableParent = $this.parents( ':have-scroll' );

			if( !_scrollableParent.length ) {
				return false;
			}

			var pos = methods['getRelativePosition'].call( this );
			var _topBorder = pos.top - _scrollableParent.scrollTop();
			var _leftBorder = pos.left - _scrollableParent.scrollLeft();

			return {
				"elemTopBorder": _topBorder,
				"elemBottomBorder": _topBorder + $this.height(),
				"elemLeftBorder": _leftBorder,
				"elemRightBorder": _leftBorder + $this.width(),
				"viewport": _scrollableParent,
				"viewportHeight": _scrollableParent.height(),
				"viewportWidth": _scrollableParent.width()
			};
		},
		getRelativePosition: function() {
			var fromTop = 0;
			var fromLeft = 0;

			for( var obj = $( this ).get( 0 ); obj && !$( obj ).is( ':have-scroll' ); obj = obj.offsetParent ) {
				fromTop += obj.offsetTop;
				fromLeft += obj.offsetLeft;
			}

			return { "top": Math.round( fromTop ), "left": Math.round( fromLeft ) };
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
				"allowPartly": false
			}, options );

			var ret = { "inside": false, "posY": '', "posX": '' };
			var pos = methods['getElementPosition'].call( this );

			if( !pos ) {
				ret.inside = true;
				return ret;
			}

			var _above = pos.elemTopBorder - settings.threshold < 0;
			var _below = pos.viewportHeight < pos.elemBottomBorder + settings.threshold;
			var _left = pos.elemLeftBorder - settings.threshold < 0;
			var _right = pos.viewportWidth < pos.elemRightBorder + settings.threshold;

			if( settings.allowPartly ) {
				var _partlyAbove = pos.elemTopBorder - settings.threshold < 0 && pos.elemBottomBorder - settings.threshold >= 0;
				var _partlyBelow = pos.viewportHeight < pos.elemBottomBorder + settings.threshold && pos.viewportHeight > pos.elemTopBorder + settings.threshold;
				var _partlyLeft = pos.elemLeftBorder - settings.threshold < 0 && pos.elemRightBorder - settings.threshold >= 0;
				var _partlyRight = pos.viewportWidth < pos.elemRightBorder + settings.threshold && pos.viewportWidth > pos.elemLeftBorder + settings.threshold;
			}


			if( !_above && !_below && !_left && !_right ) {
				ret.inside = true;
				return ret;
			}

			if( settings.allowPartly ) {
				if( _partlyAbove && _partlyBelow ) {
					ret.posY = 'exceeds';
				} else if( ( _partlyAbove && !_partlyBelow ) || ( _partlyBelow && !_partlyAbove ) ) {
					ret.posY = _partlyAbove ? 'partly-above' : 'partly-below';
				} else if( !_above && !_below ) {
					ret.posY = 'inside';
				} else {
					ret.posY = _above ? 'above' : 'below';
				}

				if( _partlyLeft && _partlyRight ) {
					ret.posX = 'exceeds';
				} else if( ( _partlyLeft && !_partlyRight ) || ( _partlyLeft && !_partlyRight ) ) {
					ret.posX = _partlyLeft ? 'partly-above' : 'partly-below';
				} else if( !_left && !_right ) {
					ret.posX = 'inside';
				} else {
					ret.posX = _left ? 'left' : 'right';
				}
			} else {
				if( _above && _below ) {
					ret.posY = 'exceeds';
				} else if( !_above && !_below ) {
					ret.posY = 'inside';
				} else {
					ret.posY = _above ? 'above' : 'below';
				}

				if( _left && _right ) {
					ret.posX = 'exceeds';
				} else if( !_left && !_right ) {
					ret.posX = 'inside';
				} else {
					ret.posX = _left ? 'left' : 'right';
				}
			}

			return ret;
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
			"allowPartly": false
		}, options );

		if( typeof callBack == 'string' && callBack == 'destroy' ) {
			return this.each( function() {
				var $this = $( this );

				var _scrollable = $this.parent( ':have-scroll' );

				if( !_scrollable.length || typeof $this.data( 'euid' ) == 'undefined' ) {
					return true;
				}

				if( _scrollable.get( 0 ).tagName == "BODY" ) {
					$( window ).unbind( ".viewport" + $this.data( 'euid' ) );
					$this.removeData( 'euid' );
				} else {
					_scrollable.unbind( ".viewport" + $this.data( 'euid' ) );
					$this.removeData( 'euid' );
				}
			} );
		} else if( typeof callBack != 'function' ) {
			$.error( 'Callback function not defined' );
			return this;
		}

		return this.each( function() {
			var $this = $( this );
			var obj = this;

			if( typeof $this.data( 'euid' ) == 'undefined' )
				$this.data( 'euid', methods['generateEUID'].call() );

			callBack.apply( obj, [ methods['getState'].apply( obj, [ settings ] ) ] );

			var _scrollable = $( $this ).parents( ':have-scroll' );

			if( !_scrollable.length ) {
				callBack.apply( obj, [ { "inside": true, "posY": '', "posX": '' } ] );
				return true;
			}

			if( _scrollable.get( 0 ).tagName == "BODY" ) {
				$( window ).bind( "scroll.viewport" + $this.data( 'euid' ), function() {
					callBack.apply( obj, [ methods['getState'].apply( obj, [ settings ] ) ] );
				} );
			} else {
				_scrollable.bind( "scroll.viewport" + $this.data( 'euid' ), function() {
					callBack.apply( obj, [ methods['getState'].apply( obj, [ settings ] ) ] );
				} );
			}
		} );
	};
})( jQuery );