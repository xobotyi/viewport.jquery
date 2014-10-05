# jquery.viewport

Viewport - is simple jQuery plugin adds custom pseudo-selectors and handlers for simple element detection inside or outside of viewport.

<img src="http://habrastorage.org/files/021/625/7eb/0216257ebf684f2f8d7ada92cda6c3c3.jpg"/>

## How to use?
Viewport depends on jQuery, include them wherever you want:

```html
<script src="jquery.js" type="text/javascript"></script>
<script src="jquery.viewport.js" type="text/javascript"></script>
```

Now you able to use these pseudo-selectors anywhere in your code:

```javascript
$( ":in-viewport" );
$( ":above-the-viewport" );
$( ":below-the-viewport" );
$( ":left-of-viewport" );
$( ":right-of-viewport" );
$( ":partly-above-the-viewport" );
$( ":partly-below-the-viewport" );
$( ":partly-left-of-viewport" );
$( ":partly-right-of-viewport" );
$( ":have-scroll" );
```

## A bit closer

Let's see each group of pseudo-selectors a little closer.

##### Element fully fits into the viewport

```javascript
$( ":in-viewport" );
```

This pseudo-selector returns <code><is>true</i></code> if element is inside and fully fits inside the viewport and returns <code><i>false</i></code> if any side of element extends beyond the viewport.

##### Any side of element extends beyond the viewport

```javascript
$( ":above-the-viewport" );
$( ":below-the-viewport" );
$( ":left-of-viewport" );
$( ":right-of-viewport" );
```

These pseudo-selectors returns <code><i>true</i></code> if the corresponding side of the element extends beyond the viewport, so if element's top side extends beyond the viewport's top border, this code:
```javascript
$( "element-selector" ).is( ":above-the-viewport" );
```
will return <code><i>true</i></code>.

##### Any part of the element is within the viewport

```javascript
$( ":partly-above-the-viewport" );
$( ":partly-below-the-viewport" );
$( ":partly-left-of-viewport" );
$( ":partly-right-of-viewport" );
```

Unlike previous group, these returns <code><i>true</i></code> if any part is within viewport, but, returns <code><i>false</i></code> if element fully fits into the viewport. Same, <code><i>false</i></code> value returns if element fully extends beyond the viewport.

##### Threshold parameter

Everything, listed earlier, pseudo-selectors have optional parameter, "threshold".<br>
Threshold extends the viewport area with it's value.

<img src="http://habrastorage.org/files/6d3/76b/c65/6d376bc6567f4496a0a79e84c99e7c68.jpg"/>

```javascript
$( ":in-viewport(20)" );
```

##### Element have scroll

```javascript
$( ":have-scroll" );
```

This pseudo-selector returns <code><i>true</i></code> if element have scrollbars, actually, it returns <code><i>true</i></code> if content's dimensions exceeds element's dimensions.<br>
In Viewport plugin, this pseudo-selector uses for determining element's viewport, mostly, element's viewport - is parent element having the scrollbars.
<blockquote><b>As it is necessary to clarify</b> that, depending on the context, the viewport can be any DOM element, dimensions whose content exceeds his own.</blockquote>

## Element position watcher

TODO: finish this readme
