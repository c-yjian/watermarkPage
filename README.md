# 给网站页面或者某个容器添加水印

## watermark-webpage
add a watermark in your webpage or specified element container
also you can set watermark style

## Installation
```
  npm install  watermark-webpage --save
```

## usage
```$xslt
import watermark from 'watermark-webpage';

//container default value is document.body
const wmContainer:HTMLElement = document.getElementById('wmcontainer');
this.waterMark:watermark = new watermark({
      container: wmContainer, 
      content: 'yangjian',
      fillStyle: "rgba(184, 184, 184, 0.4)",
      width: 250,
      height: 200
    });
 
 // destroy the watermark
 this.waterMark.destroy()
    
```

#demo online
https://codesandbox.io/s/boring-cori-1i9k5
