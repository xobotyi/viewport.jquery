# jquery.viewport

Viewport - is simple jQuery plugin adds custom pseudo-selectors and handlers for simple element detection inside or outside of viewport.

<b>Author:</b> Anton Zinoviev<br>
<b>Requires:</b> jQuery 1.2.6+

<img src="http://habrastorage.org/files/021/625/7eb/0216257ebf684f2f8d7ada92cda6c3c3.jpg"/>

## How to use?
Primary, you should download jQuery.viewport plugin, via <a href="https://github.com/xobotyi/jquery.viewport/releases/latest">GitHub</a>, or using Bower:

```bash
bower install jquery-viewport
```

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

<blockquote><b>IMPORTANT!</b>
<br/><br/>
Note, that plugin uses scroll autodetector, which works incorrectly in some situations:
If parent element don't have bounds( padding, border, overflow != visible ), children's margins flows to parent element, and offsetHeight calculates parent's height without these margins. While scrollHeight calculates content's height with these margins, so parent element recognises as having scroll and as viewport to current context.</blockquote>

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

If you need continuous tracking of element's position, you can call plugin on it.

```javascript
$( ".some-element" ).viewportTrack( {
    "threshold": 0,
    "allowPartly": false,
    "forceViewport": false,
    "tracker": function( state ){
        //your code
    },
    "checkOnInit": true
} );
```

The callback function is an optional parameter, if you'll call plugin without callback function, single position calculation will be made.<br>
Element's state returns as callback parameter.<br>
Return value is an object with 3 parameters:

```javascript
var res = { "inside": false, "posY": '', "posX": '' };
```

<code>inside</code> parameter is boolean, and becomes <code><i>true</i></code> if element is inside and completely fits the viewport, in that case <code>posY</code> and <code>posX</code> parameters are empty.
Otherwise, if <code>inside</code> parameter returned as <code><i>false</i></code>, <code>posY</code> and <code>posX</code> parameters will return position of an element on the appropriate axis.

<code>posY</code> and <code>posX</code> parameters can return the following values:
<ul>
 <li><b>inside</b> - in case the element completely fits in viewport on the appropriate axis,</li>
 <li><b>exceeds</b> - in case element size exceeds viewport size on the appropriate axis,</li>
 <li><b>above</b> - returns in <code>posY</code> parameter, if element's top side crossed viewport's top side,</li>
 <li><b>below</b> - returns in <code>posY</code> parameter, if element's bottom side crossed viewport's bottom side,</li>
 <li><b>left</b> - returns in <code>posX</code> parameter, if element's left side crossed viewport's left side,</li>
 <li><b>right</b> - returns in <code>posX</code> parameter, if element's right side crossed viewport's right side.</li>
</ul>

#### Plugin options

##### threshold

Threshold parameter was described above.

##### allowPartly    
Turning on <code>allowPartly</code> option extends range of returning states with following:

<ul>
 <li><b>partly-above</b> - returns in <code>posY</code> parameter, if element's top side crossed viewport's top side, but bottom side didn't,</li>
 <li><b>partly-below</b> - returns in <code>posY</code> parameter, if element's bottom side crossed viewport's bottom side, but top side didn't,</li>
 <li><b>partly-left</b> - returns in <code>posX</code> parameter, if element's left side crossed viewport's left side, but right side didn't,</li>
 <li><b>partly-right</b> - returns in <code>posX</code> parameter, if element's right side crossed viewport's right side, but left side didn't.</li>
 </ul>

<img src="http://habrastorage.org/files/d12/398/779/d1239877992d45c98e98e9a30f7bee0b.jpg"/>

##### forceViewport

If you exactly know viewport's selector, you can specify it with this parameter.

##### checkOnInit
By default, this option turned on, and tracker fires callback on initiantion. Turning this callback to <code>false</code> you can disable initial callback fire.


### Untie tracker

If there is no more need to track element, you can use "destroy" parameter.

```javascript
$( ".some-element" ).viewportTrack('destroy');
```
