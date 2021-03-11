# boxjam

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![Slack](https://img.shields.io/badge/Join-Slack-blue)](https://callforcode.org/slack)

Make the little boxes fit inside the bigger box.

## Description

This module was created as part of the [Choirless project](https://github.com/choirless), now released as part of [Rend-o-matic](https://github.com/Rend-o-matic).

We needed a way to figure out how to fit _n_ rectangles of varying dimensions into a set space so we could render a video wall of varying participant numbers without having to have preset spaces or dimensions for each case.

**boxjam** allows you to pass through a container size and a list of rectangles of varying sizes, and will proportionately scale and position those rectangles until they fit inside the container.

## Usage

#### Installation

```
npm i -S boxjam
```

#### Example
```javascript
const boxjam = require('boxjam');

const rectangles = [
    {id : 1, width : 640, height : 480 },
    {id : 2, width : 720, height : 480 },
    {id : 3, width : 200, height : 100 },
    {id : 4, width : 300, height : 150 }
];

const container = { width : 1920, height : 1080 };
const margin = 10;
const shouldCenter = true

// Scaled and positioned rectangles
const adjustedRectangles = boxjam(rectangles, container, margin, shouldCenter);

console.log(adjustedRectangles);

/*
[
    { id: 1, width: 576, height: 432, x: 343, y: 103 },
    { id: 2, width: 648, height: 432, x: 929, y: 103 },
    { id: 3, width: 864, height: 432, x: 91, y: 545 },
    { id: 4, width: 864, height: 432, x: 965, y: 545 }
]
*/ 
```

## boxjam Arguments

```javascript
boxjam(
    `[RECTANGLES ARRAY]`, 
    `[CONTAINER OBJ]`, 
    `[MARGIN NUMBER]`, 
    `[SHOULD CENTER BOOL]`
);
```

#### RECTANGLES

This is a list of objects which have `width` and `height` properties. The `width` and `height` properties should be integers, but will work with floats. Floats and integers will be rounded by the algorithm. The objects can have other properties passed (such as an ID) which will be returned along with the calculated values.

```json
[ 
    {
        width : <NUMBER>,
        height : <NUMBER>
    },
    {
        width : <NUMBER>,
        height : <NUMBER>
    } 
]
```

#### CONTAINER

An object which contains `height` and `width` properties of the container you wish to fit the rectangles into.

```json
{
    width : <NUMBER>
    height : <NUMBER>
}
```

#### MARGIN

_Default: 0_

If you wish to have a space between your rectangles, you can pass a number as the `margin` argument. This value is relative to the container dimensions and the spaces.

#### SHOULD CENTER

_Default: false_

If you wish to have the rectangles vertically and horizontally aligned within the container when the scaling and positioning has completed, you can pass `true` and the rectangles will be aligned. Otherise, they will align from the top left.

