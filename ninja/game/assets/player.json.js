goog.provide('lime.ASSETS.player.json');
goog.require('soy');

lime.ASSETS.player.json.data = function(opt_data) { 
return {"frames": [

{
	"filename": "down.png",
	"frame": {"x":2,"y":396,"w":200,"h":204},
	"rotated": true,
	"trimmed": true,
	"spriteSourceSize": {"x":35,"y":76,"w":200,"h":204},
	"sourceSize": {"w":280,"h":280}
},
{
	"filename": "left.png",
	"frame": {"x":262,"y":276,"w":258,"h":220},
	"rotated": true,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":60,"w":258,"h":220},
	"sourceSize": {"w":280,"h":280}
},
{
	"filename": "normal.png",
	"frame": {"x":282,"y":2,"w":272,"h":222},
	"rotated": true,
	"trimmed": true,
	"spriteSourceSize": {"x":8,"y":58,"w":272,"h":222},
	"sourceSize": {"w":280,"h":280}
},
{
	"filename": "right.png",
	"frame": {"x":2,"y":174,"w":258,"h":220},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":22,"y":60,"w":258,"h":220},
	"sourceSize": {"w":280,"h":280}
},
{
	"filename": "up.png",
	"frame": {"x":2,"y":2,"w":170,"h":278},
	"rotated": true,
	"trimmed": true,
	"spriteSourceSize": {"x":54,"y":0,"w":170,"h":278},
	"sourceSize": {"w":280,"h":280}
}],
"meta": {
	"app": "http://www.texturepacker.com",
	"version": "1.0",
	"image": "player.png",
	"format": "RGBA8888",
	"size": {"w":512,"h":1024},
	"scale": "1",
	"smartupdate": "$TexturePacker:SmartUpdate:dc023948451eaf2f6141222420340e87$"
}
}
;
}