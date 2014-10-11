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
<blockquote><b>It is necessary to clarify</b> that, depending on the context, the viewport can be any DOM element, whose content size exceeds his own.</blockquote>

## Element's position tracker

If you need continuous tracking of element's position, you can call plugin, on it.

```javascript
$( ".some-element" ).viewportTrace( function( state ){
    //your callback code
 }, {
    "threshold": 0,
    "allowPartly": false,
    "allowMixedStates": false
 });
```

The callback function is required, if you'll try to call plugin without callback function, exception will be generated.<br>
Element's state returns in callback parameter.

#### Plugin options

##### threshold

Threshold parameter was described above.

##### allowPartly

By default element can have 5 states:

     <ul>
         <li>inside</li>
         <li>above</li>
         <li>below</li>
         <li>left</li>
         <li>right</li>
     </ul>
     
<blockquote>Note, that any type of <code>above</code> and <code>below</code> states have priority above <code>left</code> and <code>right</code> states.
<img src="http://habrastorage.org/files/3ea/308/683/3ea3086831d34d778f0618a026d626d7.jpg"/></blockquote>
Turning on <code>allowPartly</code> option extends range of returning states with following:

    <ul>
         <li>partly-above</li>
         <li>partly-below</li>
         <li>partly-left</li>
         <li>partly-right</li>
     </ul>

<img src="http://habrastorage.org/files/d12/398/779/d1239877992d45c98e98e9a30f7bee0b.jpg"/>

##### allowMixedStates

Turns on mixing of different element-states.
As previously, <code>above</code> and <code>below</code> states have priority above others, and "full" states goes before "partly" states, so return value looks like:<br>
<code>above right</code><br>
or<br>
<code>right partly-below</code>