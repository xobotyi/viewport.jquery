/**
 * @Author Anton Zinovyev
 * @Package: jquery.viewport
 * @License: http://www.opensource.org/licenses/mit-license.php
 */
(function ($) {
    /** @return boolean */
    function hasScroll(element) {
        return element ? element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth : false;
    }

    /** @return HTMLElement */
    function getScrollableParent(element) {
        if (!element) { return window.document.body; }

        while (element.tagName !== 'BODY' && !hasScroll(element)) {
            element = element.parentElement;
        }

        return element;
    }

    /** @return {top, bottom, left, right, width, height, viewportWidth, viewportHeight} */
    function getRelativePosition(element, viewport) {
        let vpRect = viewport
                     ? (viewport.tagName === 'BODY' ? {top: 0, left: 0, width: window.innerWidth, right: window.innerWidth, height: window.innerHeight, bottom: window.innerHeight} : viewport.getBoundingClientRect())
                     : {top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0},
            elRect = element
                     ? element.getBoundingClientRect()
                     : {top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0};

        return {
            viewport,
            viewportWidth:  vpRect.width,
            viewportHeight: vpRect.height,

            element,
            elementWidth:  elRect.width,
            elementHeight: elRect.height,

            top:    elRect.top - vpRect.top,
            bottom: vpRect.bottom - elRect.bottom,
            left:   elRect.left - vpRect.left,
            right:  vpRect.right - elRect.right,
        };
    }

    /** @return boolean */
    function inViewport(element, threshold = 0, viewport) {
        let pos = getRelativePosition(element, viewport);

        return pos.top - threshold >= 0 && pos.bottom - threshold >= 0 && pos.left - threshold >= 0 && pos.right - threshold >= 0;
    }

    /** @return {inViewport, vertical, horizontal, top, bottom, left, right, width, height, viewportWidth, viewportHeight}  */
    function getState(element, threshold = 0, allowPartly = false, viewport) {
        let pos = getRelativePosition(element, viewport);

        pos.inViewport = pos.top - threshold >= 0 && pos.bottom - threshold >= 0 && pos.left - threshold >= 0 && pos.right - threshold >= 0;

        if (pos.top - threshold >= 0 && pos.bottom - threshold >= 0) {
            pos.vertical = 'inside';
        }
        else if (pos.top - threshold <= 0 && pos.bottom - threshold <= 0) {
            pos.vertical = 'exceeds';
        }
        else if (allowPartly) {
            pos.vertical = pos.top - threshold <= 0
                           ? (pos.bottom - threshold - pos.viewportHeight) > pos.elementHeight ? 'above' : 'partly-above'
                           : (pos.top - threshold - pos.viewportHeight) > pos.elementHeight ? 'below' : 'partly-below';
        }
        else {
            pos.vertical = pos.top - threshold <= 0 ? 'above' : 'below';
        }

        if (pos.left - threshold >= 0 && pos.right - threshold >= 0) {
            pos.horizontal = 'inside';
        }
        else if (pos.left - threshold <= 0 && pos.right - threshold <= 0) {
            pos.horizontal = 'exceeds';
        }
        else if (allowPartly) {
            pos.horizontal = pos.left - threshold <= 0
                             ? (pos.right - threshold - pos.viewportWidth) > pos.elementWidth ? 'left' : 'partly-left'
                             : (pos.left - threshold - pos.viewportWidth) > pos.elementWidth ? 'right' : 'partly-right';
        }
        else {
            pos.horizontal = pos.top - threshold <= 0 ? 'left' : 'right';
        }

        return pos;
    }

    let viewportFunctions = {
        /** @return boolean */
        hasScroll() {
            if (!this.length) { return false; }

            return hasScroll(this[0]);
        },

        /** @return HTMLElement */
        scrollableParent() {
            return getScrollableParent(this[0]);
        },

        /** @return {top, bottom, left, right, width, height, viewportWidth, viewportHeight} */
        relativePosition(viewport = this.scrollableParent()) {
            return getRelativePosition(this[0], viewport ? (viewport instanceof $ ? viewport[0] : viewport) : this.scrollableParent());
        },

        /** @return boolean */
        inViewport(threshold = 0, viewport) {
            if (!this.length) { return false; }

            return inViewport(this[0], threshold, viewport || this.scrollableParent());
        },

        /** @return {inViewport, vertical, horizontal, top, bottom, left, right, width, height, viewportWidth, viewportHeight}  */
        getState(threshold = 0, allowPartly = false, viewport) {
            viewport = viewport || this.scrollableParent();

            if (!this.length) { return {inViewport: false, vertical: 'inside', horizontal: 'inside', top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0, viewportWidth: 0, viewportHeight: 0}; }

            return getState(this[0], threshold, allowPartly, viewport);
        },
    };

    $.fn.viewport = function () {
        return {...this, ...viewportFunctions};
    };

    $.extend($.expr[':'], {
        hasScroll(element) {
            return hasScroll(element);
        },
        hasScrollVertical(element) {
            return element.offsetHeight < element.scrollHeight;
        },
        hasScrollHorizontal(element) {
            return element.offsetWidth < element.scrollWidth;
        },
        inViewport(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined;

            return inViewport(element, threshold, viewport || getScrollableParent(element));
        },
        aboveTheViewport(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.top - threshold <= 0 && pos.bottom >= 0;
        },
        belowTheViewport(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.bottom - threshold <= 0 && pos.top >= 0;
        },
        leftOfViewport(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.left - threshold <= 0 && pos.right >= 0;
        },
        rightOfViewport(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.right - threshold <= 0 && pos.left >= 0;
        },
        aboveTheViewportPartly(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.top - threshold <= 0 && pos.bottom >= 0 && (pos.bottom - threshold - pos.viewportHeight) > pos.elementHeight;
        },
        belowTheViewportPartly(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.bottom - threshold <= 0 && pos.top >= 0 && (pos.top - threshold - pos.viewportHeight) > pos.elementHeight;
        },
        leftOfViewportPartly(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.left - threshold <= 0 && pos.right >= 0 && (pos.left - threshold - pos.viewportWidth) > pos.elementWidth;
        },
        rightOfViewportPartly(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.right - threshold <= 0 && pos.left >= 0 && (pos.right - threshold - pos.viewportWidth) > pos.elementWidth;
        },
        exceedsViewport(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined;

            return !inViewport(element, threshold, viewport || getScrollableParent(element));
        },
        exceedsViewportVertical(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.top - threshold < 0 && pos.bottom - threshold < 0;
        },
        exceedsViewportHorizontal(element, i, meta) {
            let param     = (meta[3] || '').split(','),
                threshold = (param[0] && (param[0] = param[0].trim())) ? parseInt(param[0], 10) : 0,
                viewport  = (param[1] && (param[1] = param[1].trim())) ? ($(param[1])[0] || undefined) : undefined,
                pos       = getRelativePosition(element, viewport || getScrollableParent(element));

            return pos.left - threshold < 0 && pos.right - threshold < 0;
        },
    });
})(jQuery);