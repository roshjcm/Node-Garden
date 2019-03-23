/* 
    Could be used to make random colors but don't know where to put it if I put it at line 100 or after line 31, the colors are random but same for all nodes and they keep changing all the times (which makes sense but is not waht I want)
    
            var colorNode = "#"+Math.floor(Math.random()*16777215).toString(16);
            context.fillStyle= 'colorNode';

*/


/* function calculating the distance between to nodes using (x,y) coordinates. Distance(A,B) = sqrt((dxb-dxa)^2 + (dyb-dya)^2)) */
function getDistance(vectorA, vectorB) {
    const dx = vectorB.x - vectorA.x;
    const dy = vectorB.y - vectorA.y;

  return Math.sqrt(dx * dx + dy * dy);
}

/* Define a Node */
class Node {
  constructor(options) {
    const defaults = {
      vx: Math.random() * 3 - 1, /* if increase the mult, the movement of the nodes are more to the right (since x-axis) */
      vy: Math.random() * 3 - 1, /* if increase both x and y, it somehow looks like the movement is accelerating (at least visually) */
      radius: 4,
    colour: "#"+Math.floor(Math.random()*16777215).toString(16),
    };
    Object.assign(this, options, defaults);

  }

    render(context) {
    const { x, y, radius, colour } = this;
    context.fillStyle = colour;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI*2);
    context.fill();
  }

  update(context, width, height) {
    const { x, y, vx, vy } = this;

    this.x += vx;
    this.y += vy;

    if (x < 0) { /* if x is negative (node reaches the left end side of the screen), then x= width (node appears on right end side) */
      this.x = width;
    } else if (x > width) { /* if node reachers right end side, appears on left end side */
      this.x = 0
    }

    if (y < 0) { /* same logic: if reachers bottom, appears on top of the screen */
      this.y = height;
    } else if (y > height) { /*if reaches top, appears on bottom */
      this.y = 0
    }

    this.render(context);
  }
}


class Nodes {
  constructor(options) {
    const defaults = {
      length: 150, /*maybe the number of nodes?? big question mark there */
      maxDistance: 250 /*self explanatory: max distance between nodes to have an edge */    
    };

    Object.assign(this, options, defaults);

    this.init();
  }

  init() {
    const { length, width, height } = this;

    this.nodes = [];

    for (let i = 0; i < length; i++) {
      this.nodes.push(new Node({
        x: Math.random() * width, /* multiply by the distance (x-axis) in which nodes can appear at the beginning */
        y: Math.random() * height, /* same logic with top/bottom */
      }));
    }
  }

  render(context) {
    /* context.fillStyle = 'OrangeRed'; /* color of the nodes */

    const { length, nodes, maxDistance, width, height } = this;
    for (let i = 0; i < length; i++) {
      this.nodes[i].update(context, width, height); /* moves node + check if node is out of the screen */
    }

    /* check for each node if they have a node in their maxDistance periphery => if yes, create an edge between the two */
    for (let i = 0; i < length - 1; i++){
      const nodeA = nodes[i];

      for (let j = i + 1; j < length; j++) {
        const nodeB = nodes[j];
        const distance = getDistance(nodeA, nodeB);

        if (distance < maxDistance) { 
          context.lineWidth = 1 - distance / maxDistance; /* increasing it makes the line thicker */
          context.strokeStyle = 'CornFlowerBlue'; /* color of the edges */
          context.beginPath();
          context.moveTo(nodeA.x, nodeA.y);
          context.lineTo(nodeB.x, nodeB.y);
          context.stroke();
        }

      }

    }

  }

}


class NodeGarden {
  constructor(element, options) {
    const defaults = {
      width: window.innerWidth, /* innerWidth property returns the width of a window's content area */
      height: window.innerHeight /*same with the height */
    };

    Object.assign(this, options, defaults); /* Object.assign() copies the values (of all enumerable own properties) from one or more source objects to a target object. The target object is the first parameter and is also used as the return value. */

    this.element = element;

    this.init();
  }

  init() {
    const canvas  = document.querySelector(this.element);
    this.context = canvas.getContext('2d');
    const width  = canvas.width  = this.width;
    const height = canvas.height = this.height;
      
    this.nodes = new Nodes({
      width,
      height
    });
  }

  render(context) {
    this.nodes.render(context)
  }

  update() {
    const { context, width, height } = this;
    this.context.fillStyle ='#001340';
    this.context.fillRect(0, 0, width, height);
    this.render(context);

    requestAnimationFrame(this.update.bind(this));
  }

}

const nodeGarden = new NodeGarden('.js-canvas');

nodeGarden.update();