# viewport.jquery
viewport - is simple but handy jQuery plugin adding methods and CSS selectors to check if element is in certain viewport.

<img src="http://habrastorage.org/files/021/625/7eb/0216257ebf684f2f8d7ada92cda6c3c3.jpg"/>

## Requirements
* [jQuery](https://jquery.com) 3+ (written and tested with 3.3.1)

## Installation
Download it from <a href="https://github.com/xobotyi/viewport.jquery/releases/latest">GitHub</a>, or install via NPM:
```bash
npm i viewport.jquery
```

Include it in your JS code or link it in html page
```html
<script src="viewport.jquery.js" type="text/javascript"></script>
```

Now you able to
```javascript
$(".myAwesomeElement:in-viewport").yaay();
// or
$(".myAwesomeElement").viewport().inViewport(); // true if in viewport
```

## Usage
//TBD