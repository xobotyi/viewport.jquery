/**
 * @Author Anton Zinovyev
 * @Package: jquery.viewport
 * @License: http://www.opensource.org/licenses/mit-license.php
 */
(function ($) {
    /**
     * @param v {*}
     * @returns {boolean}
     */
    function isString(v) {
        return typeof v === 'string';
    }

    /**
     * @param v {*}
     * @returns {boolean}
     */
    function isset(v) {
        return v !== null && typeof v !== 'undefined';
    }

    let methods = {
        getRelativePosition($el, viewportSelector = ':hasScroll', $viewport = null) {
            let top  = 0,
                left = 0,
                obj;

            for (let $obj = $el; $obj.length; $obj = $obj.parent()) {
                obj = $obj[0];
                if (($viewport && $viewport[0] === obj) || $obj.is(viewportSelector)) {break;}

                if (!isset(obj.vpPos) || Date.now() - obj.vpPos.tag > 500) {
                    // small cache to improve performance
                    top += obj.offsetTop;
                    left += obj.offsetLeft;

                    obj.vpPos = {top, left, tag: Date.now()};
                }
                else {
                    top += obj.vpPos.top;
                    left += obj.vpPos.left;
                }
            }

            return {top: Math.round(top), left: Math.round(left)};
        },
        getPosition($el, viewportSelector = ':hasScroll') {
            $el = $el instanceof $ ? $el : $($el);

            let $viewport = $el.parents(viewportSelector).last();

            if (!$viewport.length) {
                return false;
            }

            let pos        = this.getRelativePosition($el, null, $viewport),
                topBorder  = pos.top - $viewport.scrollTop(),
                leftBorder = pos.left - $viewport.scrollLeft();

            return {
                borderTop:    topBorder,
                borderLeft:   leftBorder,
                borderBottom: topBorder + $el.height(),
                borderRight:  leftBorder + $el.width(),

                viewport:       $viewport,
                viewportHeight: $viewport.height(),
                viewportWidth:  $viewport.width(),
            };
        },

        isAbove(el, threshold = 0) {
            let pos = this.getPosition(el);
            return pos ? pos.borderTop - threshold < 0 : false;
        },
        isBelow(el, threshold = 0) {
            let pos = this.getPosition(el);
            return pos ? pos.borderBottom - threshold < 0 : false;
        },
        isLeftOf(el, threshold = 0) {
            let pos = this.getPosition(el);
            return pos ? pos.borderLeft - threshold < 0 : false;
        },
        isRightOf(el, threshold = 0) {
            let pos = this.getPosition(el);
            return pos ? pos.borderRight - threshold < 0 : false;
        },

        isPartlyAbove(el, threshold = 0) {
            let pos = this.getPosition(el);
            return pos ? pos.borderTop - threshold < 0 && pos.borderBottom - threshold >= 0
                       : false;
        },
        isPartlyBelow(el, threshold = 0) {
            let pos = this.getPosition(el);
            return pos ? pos.viewportHeight < pos.borderBottom + threshold && pos.viewportHeight > pos.borderTop + threshold
                       : false;
        },
        isPartlyLeftOf(el, threshold = 0) {
            let pos = this.getPosition(el);
            return pos ? pos.borderLeft - threshold < 0 && pos.borderRight - threshold >= 0 :
                   false;
        },
        isPartlyRightOf(el, threshold = 0) {
            let pos = this.getPosition(el);
            return pos ? pos.viewportWidth < pos.borderRight + threshold && pos.viewportWidth > pos.borderLeft + threshold
                       : false;
        },

        isInViewport(el, threshold = 0) {
            let pos = this.getPosition(el);

            return pos ? !(pos.borderTop - threshold < 0)
                         && !(pos.viewportHeight < pos.borderBottom + threshold)
                         && !(pos.borderLeft - threshold < 0)
                         && !(pos.viewportWidth < pos.borderRight + threshold) : true;
        },

        getState(el, threshold = 0, viewportSelector = ':hasScroll', $viewport = null, allowPartly = false) {
            let res = {"inside": false, "posY": '', "posX": ''},
                pos = this.getPosition(el, viewportSelector);

            if (!pos) {
                res.inside = true;
                return res;
            }

            let _above = pos.borderTop - threshold < 0,
                _below = pos.viewportHeight < pos.borderBottom + threshold,
                _left  = pos.borderLeft - threshold < 0,
                _right = pos.viewportWidth < pos.borderRight + threshold,
                _partlyAbove,
                _partlyBelow,
                _partlyLeft,
                _partlyRight;

            if (!_above && !_below && !_left && !_right) {
                res.inside = true;
                return res;
            }

            if (allowPartly) {
                _partlyAbove = pos.borderTop - threshold < 0 && pos.borderBottom - threshold >= 0;
                _partlyBelow = pos.viewportHeight < pos.borderBottom + threshold && pos.viewportHeight > pos.borderTop + threshold;
                _partlyLeft = pos.borderLeft - threshold < 0 && pos.borderRight - threshold >= 0;
                _partlyRight = pos.viewportWidth < pos.borderRight + threshold && pos.viewportWidth > pos.borderLeft + threshold;

                if (_partlyAbove && _partlyBelow) {
                    res.posY = 'exceeds';
                }
                else if ((_partlyAbove && !_partlyBelow) || (_partlyBelow && !_partlyAbove)) {
                    res.posY = _partlyAbove ? 'partly-above' : 'partly-below';
                }
                else if (!_above && !_below) {
                    res.posY = 'inside';
                }
                else {
                    res.posY = _above ? 'above' : 'below';
                }

                if (_partlyLeft && _partlyRight) {
                    res.posX = 'exceeds';
                }
                else if ((_partlyLeft && !_partlyRight) || (_partlyLeft && !_partlyRight)) {
                    res.posX = _partlyLeft ? 'partly-above' : 'partly-below';
                }
                else if (!_left && !_right) {
                    res.posX = 'inside';
                }
                else {
                    res.posX = _left ? 'left' : 'right';
                }
            }
            else {
                if (_above && _below) {
                    res.posY = 'exceeds';
                }
                else if (!_above && !_below) {
                    res.posY = 'inside';
                }
                else {
                    res.posY = _above ? 'above' : 'below';
                }

                if (_left && _right) {
                    res.posX = 'exceeds';
                }
                else if (!_left && !_right) {
                    res.posX = 'inside';
                }
                else {
                    res.posX = _left ? 'left' : 'right';
                }
            }

            return res;
        },

        hasScroll(el) {
            return (el.scrollHeight > el.offsetHeight || el.scrollWidth > el.offsetWidth);
        },
    };

    $.extend($.expr[':'], {
        "inViewport"(obj, index, meta) {
            return methods.isInViewport(obj, isString(meta[3]) ? parseInt(meta[3], 10) : 0);
        },
        "aboveTheViewport"(obj, index, meta) {
            return methods.isAbove(obj, isString(meta[3]) ? parseInt(meta[3], 10) : 0);
        },
        "belowTheViewport"(obj, index, meta) {
            return methods.isBelow(obj, isString(meta[3]) ? parseInt(meta[3], 10) : 0);
        },
        "leftOfViewport"(obj, index, meta) {
            return methods.isLeftOf(obj, isString(meta[3]) ? parseInt(meta[3], 10) : 0);
        },
        "rightOfViewport"(obj, index, meta) {
            return methods.isRightOf(obj, isString(meta[3]) ? parseInt(meta[3], 10) : 0);
        },
        "aboveTheViewportPartly"(obj, index, meta) {
            return methods.isPartlyAbove(obj, isString(meta[3]) ? parseInt(meta[3], 10) : 0);
        },
        "belowTheViewportPartly"(obj, index, meta) {
            return methods.isPartlyBelow(obj, isString(meta[3]) ? parseInt(meta[3], 10) : 0);
        },
        "leftOfViewportPartly"(obj, index, meta) {
            return methods.isPartlyLeftOf(obj, isString(meta[3]) ? parseInt(meta[3], 10) : 0);
        },
        "rightOfViewportPartly"(obj, index, meta) {
            return methods.isPartlyRightOf(obj, isString(meta[3]) ? parseInt(meta[3], 10) : 0);
        },
        "hasScroll"(obj) {
            return methods.hasScroll(obj);
        },
    });

    $.fn.viewportTrack = function (opt) {
        let cfg = {
            tracker:          undefined,
            threshold:        0,
            allowPartly:      false,
            viewportSelector: ':hasScroll',
            viewportElement:  undefined,
            triggerOnInit:    true,
        };

        if (!isset(opt)) {
            return methods.getState(this, cfg.threshold, cfg.viewportSelector, cfg.viewportElement, cfg.allowPartly);
        }

        if (isString(opt)) {
            switch (opt) {
                case "unbind":
                    return this.each((n, i) => {
                        if (!isset(i.vpViewports)) {return;}

                        for (let cb of i.vpViewports) {
                            if (cb[0][0].tagName === "BODY") {
                                window.removeEventListener('scroll', cb[1]);
                            }
                            else {
                                cb[0][0].removeEventListener('scroll', cb[1]);
                            }
                        }

                        i.vpViewports = undefined;
                    });

                default:
                    throw new Error(`Invalid command "${opt}" for jQuery.viewportTrack`);
            }
        }
        else if (typeof opt === 'object') {
            cfg = {...cfg, ...opt};

            if (typeof cfg.tracker !== 'function') {
                throw new Error(`tracker option has to be a function, got ${typeof cfg.tracker}`);
            }

            return this.each((n, i) => {
                let $i = $(i);

                cfg.viewportElement = cfg.viewportElement || $i.parents(cfg.viewportSelector).last();

                let cb = function () {
                    cfg.tracker.call(i, methods.getState(i, cfg.threshold, cfg.viewportSelector, cfg.viewportElement, cfg.allowPartly));
                };

                (i.vpViewports = i.vpViewports || []).push([cfg.viewportElement, cb]);

                if (cfg.triggerOnInit) {cb();}

                if (cfg.viewportElement[0].tagName === "BODY") {
                    window.addEventListener('scroll', cb, {passive: true});
                }
                else {
                    cfg.viewportElement[0].addEventListener('scroll', cb, {passive: true});
                }
            });
        }

        return this;
    };
})(jQuery);