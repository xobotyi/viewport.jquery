<h1 align="center">viewport.jquery</h1>

## About
**viewport** is simple but handy jQuery plugin adding methods and CSS selectors to check if element is in certain viewport.
Furthermore - you will be able to check position relation of two separate elements even if the are not kins.
Plugin uses [getBoundingClientRect()](https://caniuse.com/#search=getBoundingClientRect()) to determine elements positions so be sure it meets your browser support the requirements.
] version 1.x.x uses different detection principe, which will work in almost any browser but works 10-30 times slower

<img src="http://habrastorage.org/files/021/625/7eb/0216257ebf684f2f8d7ada92cda6c3c3.jpg#center"/>

## Requirements
* [jQuery](https://jquery.com) 3+ (written and tested with 3.3.1)

## Installation
Download it from [GitHub](https://github.com/xobotyi/viewport.jquery/releases/latest), or install via NPM:
```bash
npm i viewport.jquery
```

Include it in your JS code or link it in html page
```html
[script src="viewport.jquery.js" type="text/javascript"][/script]
```

Now you able to
```javascript
$(".myAwesomeElement:in-viewport").yaay();
// or
$(".myAwesomeElement").viewport().inViewport(); // true if in viewport
```

## Usage
viewport.jquery provides you two different way of relation detection: [CSS pseudo-selectors](#css-pseudo-selectors) and [jQuery methods](#jquery-methods)

### CSS pseudo-selectors
All following selectors can be used _without_ parameters and bracket.

**_threshold_** parameter must be an integer, it extends (if it positive) or reduces (if it negative) viewport sizes, but only in calculations.  
<img src="http://habrastorage.org/files/6d3/76b/c65/6d376bc6567f4496a0a79e84c99e7c68.jpg#center"/>

**_viewportSelector_** parameter must be a string, determines the selector of element that will be treated like a viewport, if more than one element corresponds given selector - the first one of them will be used. 
Otherwise viewport will be found in element's parents, it will be first element that has scroll or the BODY element of none.  

#### General
```css
:hasScroll
:hasScrollVertical
:hasScrollHorizontal
```
It will filter element if it has a scroll possibility, in meaning that element contents has bigger sizes than it's own.  

```css
:inViewport([ int threshold = 0 [, string viewportSelector ]])
```
It will filter the element if each it's border is within or equal viewport's borders.  

#### Any side of element exceeds viewport's borders
```css
:aboveTheViewport([ int threshold = 0 [, string viewportSelector ]])
:belowTheViewport([ int threshold = 0 [, string viewportSelector ]])
:leftOfViewport([ int threshold = 0 [, string viewportSelector ]])
:rightOfViewport([ int threshold = 0 [, string viewportSelector ]])
```

#### Any side of element is within viewport's borders
```css
:aboveTheViewportPartly([ int threshold = 0 [, string viewportSelector ]])
:belowTheViewportPartly([ int threshold = 0 [, string viewportSelector ]])
:leftOfViewportPartly([ int threshold = 0 [, string viewportSelector ]])
:rightOfViewportPartly([ int threshold = 0 [, string viewportSelector ]])
```

#### Element exceeds viewport size and cant fit it
```css
:exceedsViewport([ int threshold = 0 [, string viewportSelector ]])
:exceedsViewportVertical([ int threshold = 0 [, string viewportSelector ]])
:exceedsViewportHorizontal([ int threshold = 0 [, string viewportSelector ]])
```

### jQuery methods
```javascript
$('').viewport().hasScroll();
```
Return `boolean`, representing if element has scroll;

```javascript
$('').viewport().scrollableParent();
```
Return `HTMLElement`, representing first parent element that has scroll or BODY element oif none;

```javascript
$('').viewport().relativePosition([ viewport = undefined ]);
```
_viewport_ can be both `HTMLElement` or `jQuery object`, meaning as for CSS selectors;  
Return `object`:  
    `viewport` - reference to viewport element relations was calculated    
    `viewportWidth` - viewport's width in pixels on calculation moment  
    `viewportHeight` - viewport's height in pixels on calculation moment  
    `element` - reference to element relations was calculated for  
    `elementWidth` - element's width in pixels on calculation moment  
    `elementHeight` - element's height in pixels on calculation moment  
    `top` - distance in pixels from top border of element to top border of viewport  
    `bottom` - distance in pixels from bottom border of element to bottom border of viewport  
    `left` - distance in pixels from left border of element to left border of viewport  
    `right` - distance in pixels from right border of element to right border of viewport  

```javascript
$('').viewport().inViewport([ threshold = 0 [, viewport = undefined ]]);
```
_threshold_ must be an integer, meaning as for CSS selectors;  
_viewport_ can be both `HTMLElement` or `jQuery object`, meaning as for CSS selectors;  

```javascript
$('').viewport().getState([ threshold = 0 [, allowPartly = false [, viewport = undefined ]]]);
```
_threshold_ must be an integer, meaning as for CSS selectors;  
_allowPartly_ must be a boolean, allow 'partly' states. Extra calculations will be made if `true`   
_viewport_ can be both `HTMLElement` or `jQuery object`, meaning as for CSS selectors;  
Return `object`:  
    `inViewport` - boolean, is element fully fits viewport  
    `vertical` - string, element's state along vertical axis relatively to viewport  
    `horizontal` - string, element's state along horizontal axis relatively to viewport  
    `viewport` - reference to viewport element relations was calculated    
    `viewportWidth` - viewport's width in pixels on calculation moment  
    `viewportHeight` - viewport's height in pixels on calculation moment  
    `element` - reference to element relations was calculated for  
    `elementWidth` - element's width in pixels on calculation moment  
    `elementHeight` - element's height in pixels on calculation moment  
    `top` - distance in pixels from top border of element to top border of viewport  
    `bottom` - distance in pixels from bottom border of element to bottom border of viewport  
    `left` - distance in pixels from left border of element to left border of viewport  
    `right` - distance in pixels from right border of element to right border of viewport  

_vertical_ field can be: `inside`, `exceeds`, `top`, `partly-top`, `below`, `partly-below`
_horizontal_ field can be: `inside`, `exceeds`, `left`, `partly-left`, `right`, `partly-right`  