---
layout: post
title: 基于WebGL的魔兽争霸Demo
category: web
---

早就想基于魔兽争霸的模型做点东西，周末抽空研究了下，比较简单。

先看看效果。

![](/images/blog/warcraft.jpg)


## 导出魔兽争霸模型

Warcraft 3 Viewer可以读取warcraft的MPQ文件，从中选择中意的模型，然后可以分别将MDX和texture导出。为了后面使用的方便，texture导出到和mdx相同目录下，格式为jpg。

## 导入到blender

使用modelconv来将mdx文件转换为obj文件。modelconv是一个命令行程序，调用后，输入要转换的mdx文件名和要转换成的obj文件名即可。
然后使用blender来import该obj文件。

## 调整模型

自动导入的文件往往其大小和角度不符合实际需要，因此需要进行调整。

* 缩放模型
* 调整模型位置
* 调整摄像机位置
* 删掉多余的面

## 贴纹理(texture)

打开UV/Image Editor，打开贴图文件，在3D View视图中查看Textured视角，这时会发现模型已经自动贴好了纹理。但是这时候render的话会发现渲染出的模型依然是难看的灰色。因此需要新加一个Material，然后新加一个Texture，Type选择Image or Movie，Image选择之前的贴图文件，Mapping中Coordinates选择UV，这样才算真正贴好了纹理。

## 导出three.js模型

使用ThreeJS自带的blender导出插件，会自动将模型和纹理导成ThreeJS需要的json。只需将生成的js文件和texture复制到ThreeJS项目中即可正常使用。

## ThreeJS中调用模型

注意调整模型位置，纹理会自动贴好。

```js
var loader = new THREE.JSONLoader();
loader.load( { model: "warcraft/archer.js", callback: createScene } );

function createScene( geometry ) {
    var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial());
    mesh.position.x=-15;
    mesh.position.y=-5;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 4;
    scene.addObject( mesh );
}
```

