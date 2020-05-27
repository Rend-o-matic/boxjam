
function normaliseHeights(nodes){

    // sort nodes by height
    var sortedNodes = nodes.sort( (a,b) => {

        if(a.h > b.b){
            return 1
        } else {
            return -1;
        }

    } );

    // Get the median height of the nodes in the set;
    const medianHeight = sortedNodes[sortedNodes.length / 2 | 0].h;

    // Then proportionately scale all of the nodes to be the same height as the median height.
    return nodes.map(node => {

        const newW = medianHeight * node.w / node.h;
        const newH = newW * node.h / node.w;

        node.w = newW;
        node.h = newH;

        return node;

    });

}

function shrink(nodes, shrinkPercentage = 0.9){

    return nodes.map(node => {
        node.h = Math.ceil(node.h * shrinkPercentage);
        node.w = Math.ceil(node.w * shrinkPercentage);
        return node;
    });

}

function fit(nodes, container, margin = 0, center = false, normalise = true){

    // For the first pass, we're going to normalise the heights of
    // all the rectangles so that they're the same. This essentially
    // saves us having to worry about objects in one row overlapping
    // an object in the previous row

    if(normalise){
        nodes = normaliseHeights(nodes);
    }

    // Create default x/y values for each rectangle.
    nodes = nodes.map(node => {
        node.x = margin;
        node.y = margin;
        return node;
    });

    // Start working through the list of rectangles and trying
    // to place them within the bounds of the container
    for(let idx = 0; idx < nodes.length; idx += 1){

        const node = nodes[idx];

        if(idx !== 0){

            node.x = margin + nodes[idx - 1].x + nodes[idx - 1].w;
            node.y = nodes[idx - 1].y;

            // If the nodes right hand side is beyond the width of the 
            // container, reset x to the margin value and push the rectangle
            //  onto a new row.
            if(node.x + node.w > container.w){
                node.x = margin;
                node.y = margin + nodes[idx - 1].y + nodes[idx - 1].h;
            }

            // If the bottom of the rectangle is beyond the bottom of the container
            // we shrink all of the rectangles by 10%, and then we start the process 
            // over again. Yes, this is a recursive function.
            if(node.y + node.h > container.h){
                nodes = shrink(nodes);
                nodes = fit(nodes, container, margin, false, false);
            }

        }

    };

    // At this point, all of our rectangles now fit happily within the bounds of our container
    // ...or we've exceeded the maximum stack size and the program has crashed... but we'll deal
    // with that later. If we want to center all of the items within the bounds of the container
    // we can now do that here.

    if(center){

        const rows = [];
        let thisRow = [];

        // First, we work through the list of rectangles that we've now placed
        // within the bounds of the container, and break them down into rows.
        // The different rows will likely already have different widths from
        // each other, so we need to treat them individually to create 
        // the desired effect.
        for(let i = 0; i < nodes.length; i += 1){

            // Thie row is empty, so we'll put the first rectangle in there.
            if(thisRow.length === 0){
                thisRow.push(nodes[i]);
            } else {

                // Otherwise, if this rectangles y value matches the previous
                // one, add it to the row. Otherwise, it's a new row, so we'll
                // push this row to the rows array, and the create a new row
                // 'thisRow' and push this item to it.

                if(nodes[i].y === thisRow[thisRow.length - 1].y){
                    thisRow.push(nodes[i]);
                } else {
                    rows.push(thisRow);
                    thisRow = [];
                    thisRow.push(nodes[i])
                }
            }

        }

        // Push the final row 'thisRow' to the 'rows' array.
        rows.push(thisRow);

        // Here, we'll store all of the rectangles that we're about to adjust to center
        const adjustedNodes = [];

        // Calculate the vertical offset for all of the rectangles
        const extremeBottomOfSet = rows[rows.length - 1][0].y + rows[rows.length - 1][0].h;
        const verticalCenterOffset = ((container.h - extremeBottomOfSet) / 2 | 0) - (margin / 2);

        rows.forEach(row => {
            
            // Get the last item from the row and use it to calculate the horizontal offset
            // for all of the rectangles in this row
            const lastItem = row[row.length - 1];
            const extremeRightOfRow = lastItem.x + lastItem.w;
            const horizontalCenterOffset = ((container.w - extremeRightOfRow) / 2 | 0) - (margin / 2);

            // Then apply the x and y offsets to each rectangle.
            row.forEach(node => {
                node.x += horizontalCenterOffset;
                node.y += verticalCenterOffset;
                adjustedNodes.push(node);
            });

        });

        // And then set the 'nodes' variable for return
        nodes = adjustedNodes;

    }
    
    // Mission accomplished.
    return nodes;

}

module.exports = fit;