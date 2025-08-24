function createAndManipulateCanvases(originalCanvas) {
    const body = document.body;
    const newCanvas = document.createElement('canvas');
    newCanvas.width = originalCanvas.width;
    newCanvas.height = originalCanvas.height;
    const ctx = newCanvas.getContext('2d');
    let container = document.getElementById('canvasContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'canvasContainer';
        document.body.appendChild(container); // Append the container to the body or any other suitable element
        container.style.width = '100%'; // Adjust as necessary
        container.style.height = 'auto';
        container.style.display = 'none';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
    }
    container.appendChild(newCanvas);
    return newCanvas;
}

class CanvasMorpher {
    constructor(c, blobs) {
        this.ctx = c.getContext('2d');
        this.canvas = this.ctx.canvas;
        this.blobs = blobs || {}; // if not passed, will stay empty
        // console.log("called morpher", this.blobs);
        //this.ready = this.loadBlobJsonFromPath('./design/blobs.json');
    }


    morphAndDraw({radius = 0, rand = 0, arrangementType = 'dual', FillColor = "#73C6B6"}){
      // console.log("called morphAndDraw", this.blobs);
      // console.log("A is", this.blobs.A);
      if (!this.blobs.A || !this.blobs.B || !this.blobs.C || !this.blobs.D) {
        console.warn("Blobs not loaded yet.");
        return;
      }
      const CONFIG = {numCtrls: this.blobs.A.x.length, styles: {fill: FillColor}};
      const blob = interpolate2D(this.blobs.A,this.blobs.B,this.blobs.C,this.blobs.D, radius, rand);//radius should be step/20, rand {0,1}
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      drawBlob(this.ctx, blob, 0, 0, CONFIG);}

    canvasToImage(canvas) {
     return new Promise((resolve, reject) => {
       const img = new Image();
       img.onload = () => {
         resolve(img);
       };
       img.onerror = (error) => {
         console.error("Image load error:", error);
         reject(error);
       };
       img.src = canvas.toDataURL('image/png');
     });
   }

    scaleCanvas(originalCanvas, targetWidth, targetHeight){
      const aspectRatio = originalCanvas.width / originalCanvas.height;
      let newWidth, newHeight;
      if (targetWidth / targetHeight > aspectRatio) {
          newHeight = targetHeight;
          newWidth = targetHeight * aspectRatio;
      } else {
          newWidth = targetWidth;
          newHeight = targetWidth / aspectRatio;
      }
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = newWidth;
      scaledCanvas.height = newHeight;
      const scaledCtx = scaledCanvas.getContext('2d');
      scaledCtx.clearRect(0, 0, newWidth, newHeight);
      scaledCtx.drawImage(originalCanvas, 0, 0, newWidth, newHeight);
      return scaledCanvas;
     };

    MorphSingle({canvas = canvas, par = par, rand = rand}, callback) {
      // Create a canvas for original drawing
      const dim_size = 600;
      const originalCanvas = document.createElement('canvas');
      [originalCanvas.width, originalCanvas.height] = [dim_size, dim_size];
      const newCanvas = createAndManipulateCanvases(originalCanvas);
      const canvasMorpher = new CanvasMorpher(newCanvas, this.blobs);
      const originalCtx = originalCanvas.getContext('2d');

      // Draw the central image (p1)
      canvasMorpher.morphAndDraw({radius:par, rand:rand, FillColor:'#FFB6C1'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledCentralCanvas = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
      const centralImgPromise = this.canvasToImage(scaledCentralCanvas);
      // Combine the images in the new layout
      const ctx = canvas.getContext('2d');
      Promise.all([centralImgPromise]).then(([centralImg]) => {
          canvas.width = canvas.width;
          // Calculate positions for images
          const centralX = (canvas.width-centralImg.width)/2; // Centered horizontally
          const centralY = 0; // Top section of the canvas
          ctx.drawImage(centralImg, centralX, centralY); // Central image
          if (typeof callback === 'function') {
            callback();
          }
      });
    };

    MorphPair({canvas = canvas, par = par, rand = rand}, callback) {
      // Create a canvas for original drawing
      const dim_size = 600;
      const originalCanvas = document.createElement('canvas');
      [originalCanvas.width, originalCanvas.height] = [dim_size, dim_size];
      const newCanvas = createAndManipulateCanvases(originalCanvas);
      const canvasMorpher = new CanvasMorpher(newCanvas, this.blobs);
      const originalCtx = originalCanvas.getContext('2d');

      let [p1, p2] = par;
      let [n1, n2] = rand;
      // Draw the central image (p1)
      canvasMorpher.morphAndDraw({radius:p1, rand:n1, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledcleftCanvas = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
      const cleftImgPromise = this.canvasToImage(scaledcleftCanvas);
      // Draw the central image (p2)
      originalCanvas.width = originalCanvas.width;
      canvasMorpher.morphAndDraw({radius:p2, rand:n2, FillColor:'#FFB6C1'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledcrightCanvas = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
      const crightImgPromise = this.canvasToImage(scaledcrightCanvas);

      // Combine the images in the new layout
      const ctx = canvas.getContext('2d');
      Promise.all([cleftImgPromise, crightImgPromise]).then(([cleftImg, crightImg]) => {
          canvas.width = canvas.width;
          // Calculate positions for images
          const spacing = 50; // space *between* the two images
          const totalWidth = cleftImg.width + crightImg.width + spacing;
          const cleftX = (canvas.width - totalWidth) / 2;
          const crightX = cleftX + cleftImg.width + spacing;
          const centralY = 0;
          // Draw the images
          ctx.drawImage(cleftImg, cleftX, centralY); // Central image
          ctx.drawImage(crightImg, crightX, centralY); // Central image

          if (typeof callback === 'function') {
            callback();
          }
      });
    };

    SliderMorph({canvas = canvas, par = par, r = [0, 1], condition = 0}) {
      // Create a canvas for original drawing
      const dim_size = 600;
      const originalCanvas = document.createElement('canvas');
      [originalCanvas.width, originalCanvas.height] = [dim_size, dim_size];
      const newCanvas = createAndManipulateCanvases(originalCanvas);
      const canvasMorpher = new CanvasMorpher(newCanvas, this.blobs);
      // console.log("slider morph", canvasMorpher.canvas.width);
      const originalCtx = originalCanvas.getContext('2d');

      // Draw the central image (p1)
      canvasMorpher.morphAndDraw({radius:par, FillColor:'#FFB6C1'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledCentralCanvas = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
      const centralImgPromise = this.canvasToImage(scaledCentralCanvas);

      let [r1, r2] = condition !== 0 ? [r[1], r[0]] : r; // use condition to control the reference order

      // Draw the left reference (p2)
      originalCanvas.width = originalCanvas.width; //shortcut to clear originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
      canvasMorpher.morphAndDraw({radius:r1, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledLeftCanvas = this.scaleCanvas(originalCanvas, canvas.width / 3, canvas.height / 3);
      const leftImgPromise = this.canvasToImage(scaledLeftCanvas);

      // Draw the right reference (p3)
      originalCanvas.width = originalCanvas.width;
      canvasMorpher.morphAndDraw({radius:r2, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledRightCanvas = this.scaleCanvas(originalCanvas, canvas.width / 3, canvas.height / 3);
      const rightImgPromise = this.canvasToImage(scaledRightCanvas);

      // Combine the images in the new layout
      const ctx = canvas.getContext('2d');
      Promise.all([centralImgPromise, leftImgPromise, rightImgPromise]).then(([centralImg, leftImg, rightImg]) => {
          canvas.width = canvas.width;
          // Calculate positions for images
          const centralX = (canvas.width-centralImg.width)/2; // Centered horizontally
          const centralY = 0; // Top section of the canvas

          const leftX = 0; // Further left from central image
          const leftY = canvas.height - leftImg.height; // Below central image

          const rightX = canvas.width - rightImg.width; // Further right from central image
          const rightY = canvas.height - rightImg.height;  // Below central image

          // Draw the images
          ctx.drawImage(centralImg, centralX, centralY); // Central image
          ctx.drawImage(leftImg, leftX, leftY); // Left image
          ctx.drawImage(rightImg, rightX, rightY); // Right image
      });
    };

    SliderRef({canvas = canvas, par = par, r = [0, 1], condition = 0}) {
      // Create a canvas for original drawing
      const dim_size = 600;
      const originalCanvas = document.createElement('canvas');
      [originalCanvas.width, originalCanvas.height] = [dim_size, dim_size];
      const newCanvas = createAndManipulateCanvases(originalCanvas);
      const canvasMorpher = new CanvasMorpher(newCanvas, this.blobs);
      const originalCtx = originalCanvas.getContext('2d');

      let [r1, r2] = condition !== 0 ? [r[1], r[0]] : r; // use condition to control the reference order
      // Draw the left reference (p2)
      originalCanvas.width = originalCanvas.width; //shortcut to clear originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
      canvasMorpher.morphAndDraw({radius:r1, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledLeftCanvas = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
      const leftImgPromise = this.canvasToImage(scaledLeftCanvas);

      // Draw the right reference (p3)
      originalCanvas.width = originalCanvas.width;
      canvasMorpher.morphAndDraw({radius:r2, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledRightCanvas = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
      const rightImgPromise = this.canvasToImage(scaledRightCanvas);

      // Combine the images in the new layout
      const ctx = canvas.getContext('2d');
      Promise.all([leftImgPromise, rightImgPromise]).then(([leftImg, rightImg]) => {
          canvas.width = canvas.width;
          const leftX = 0; // Further left from central image
          const leftY = canvas.height + 20 - leftImg.height; // Below central image

          const rightX = canvas.width - rightImg.width; // Further right from central image
          const rightY = canvas.height + 20 - rightImg.height;  // Below central image
          // Draw the images
          // ctx.drawImage(centralImg, centralX, centralY); // Central image
          ctx.drawImage(leftImg, leftX, leftY); // Left image
          ctx.drawImage(rightImg, rightX, rightY); // Right image
      });
    };    

    SliderPair({canvas = canvas, par = par, r = [0, 1], condition = 0}) {
      // Create a canvas for original drawing
      const dim_size = 600;
      const originalCanvas = document.createElement('canvas');
      [originalCanvas.width, originalCanvas.height] = [dim_size, dim_size];
      const newCanvas = createAndManipulateCanvases(originalCanvas);
      const canvasMorpher = new CanvasMorpher(newCanvas, this.blobs);
      const originalCtx = originalCanvas.getContext('2d');

      let [p1, p2] = par; // use condition to control the reference order
      // Draw the central image (p1)
      canvasMorpher.morphAndDraw({radius:p1, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledcleftCanvas = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
      const cleftImgPromise = this.canvasToImage(scaledcleftCanvas);
      // Draw the central image (p2)
      originalCanvas.width = originalCanvas.width;
      canvasMorpher.morphAndDraw({radius:p2, FillColor:'#FFB6C1'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledcrightCanvas = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
      const crightImgPromise = this.canvasToImage(scaledcrightCanvas);

      let [r1, r2] = condition !== 0 ? [r[1], r[0]] : r; // use condition to control the reference order
      // Draw the left image (r1)
      originalCanvas.width = originalCanvas.width; //shortcut to clear originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
      canvasMorpher.morphAndDraw({radius:r1, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledLeftCanvas = this.scaleCanvas(originalCanvas, canvas.width / 3, canvas.height / 3);
      const leftImgPromise = this.canvasToImage(scaledLeftCanvas);

      // Draw the right image (r2)
      originalCanvas.width = originalCanvas.width;
      canvasMorpher.morphAndDraw({radius:r2, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledRightCanvas = this.scaleCanvas(originalCanvas, canvas.width / 3, canvas.height / 3);
      const rightImgPromise = this.canvasToImage(scaledRightCanvas);

      // Combine the images in the new layout
      const ctx = canvas.getContext('2d');
      Promise.all([cleftImgPromise, crightImgPromise, leftImgPromise, rightImgPromise]).then(([cleftImg, crightImg, leftImg, rightImg]) => {
          canvas.width = canvas.width;
          // Calculate positions for images
          const spacing = 50; // space *between* the two images
          const totalWidth = cleftImg.width + crightImg.width + spacing;
          const cleftX = (canvas.width - totalWidth) / 2;
          const crightX = cleftX + cleftImg.width + spacing;
          const centralY = 0; // Top section of the canvas

          const leftX = 0; // Further left from central image
          const rightX = canvas.width - rightImg.width; // Further right from central image
          const bottomY = canvas.height - leftImg.height; // Below central image

          // Draw the images
          ctx.drawImage(cleftImg, cleftX, centralY); // Central image
          ctx.drawImage(crightImg, crightX, centralY); // Central image
          ctx.drawImage(leftImg, leftX, bottomY); // Left image
          ctx.drawImage(rightImg, rightX, bottomY); // Right image
      });
    };

    SliderOverlap({canvas = canvas, par = par, r = [0, 1], condition = 0}) {
      // Create a canvas for original drawing
      const dim_size = 1400;
      const originalCanvas = document.createElement('canvas');
      [originalCanvas.width, originalCanvas.height] = [dim_size, dim_size];
      const newCanvas = createAndManipulateCanvases(originalCanvas);
      const canvasMorpher = new CanvasMorpher(newCanvas);
      const originalCtx = originalCanvas.getContext('2d');

      let [r1, r2] = condition !== 0 ? [r[1], r[0]] : r;
      // Draw the central image (p1)
      canvasMorpher.morphAndDraw({radius:r1, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledcleftCanvas = this.scaleCanvas(originalCanvas, canvas.width, canvas.height);
      const cleftImgPromise = this.canvasToImage(scaledcleftCanvas);
      // Draw the central image (p2)
      originalCanvas.width = originalCanvas.width;
      canvasMorpher.morphAndDraw({radius:par, FillColor:'#FFB6C1'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledcrightCanvas = this.scaleCanvas(originalCanvas, canvas.width*0.6, canvas.height*0.6);
      const crightImgPromise = this.canvasToImage(scaledcrightCanvas);

      // Draw the left image (r1)
      originalCanvas.width = originalCanvas.width; //shortcut to clear originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
      canvasMorpher.morphAndDraw({radius:r1, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledLeftCanvas = this.scaleCanvas(originalCanvas, canvas.width / 3, canvas.height / 3);
      const leftImgPromise = this.canvasToImage(scaledLeftCanvas);

      // Draw the right image (r2)
      originalCanvas.width = originalCanvas.width;
      canvasMorpher.morphAndDraw({radius:r2, FillColor:'#AFAFAF'});
      originalCtx.drawImage(newCanvas, 0, 0);
      const scaledRightCanvas = this.scaleCanvas(originalCanvas, canvas.width / 3, canvas.height / 3);
      const rightImgPromise = this.canvasToImage(scaledRightCanvas);

      // Combine the images in the new layout
      const ctx = canvas.getContext('2d');
      Promise.all([cleftImgPromise, crightImgPromise, leftImgPromise, rightImgPromise]).then(([cleftImg, crightImg, leftImg, rightImg]) => {
          canvas.width = canvas.width;
          // Calculate positions for images
          const cleftX = (canvas.width-cleftImg.width)/2; // Centered horizontally
          const crightX = (canvas.width-crightImg.width)/2; // Centered horizontally
          const cleftY = 0; // Top section of the canvas
          const crightY = (cleftImg.width-crightImg.width)/2; // Top section of the canvas

          const leftX = 0; // Further left from central image
          const rightX = canvas.width - rightImg.width; // Further right from central image
          const bottomY = canvas.height - leftImg.height; // Below central image

          // Draw the images
          ctx.drawImage(cleftImg, cleftX, cleftY); // Central image
          ctx.drawImage(crightImg, crightX, crightY); // Central image
          ctx.drawImage(leftImg, leftX, bottomY); // Left image
          ctx.drawImage(rightImg, rightX, bottomY); // Right image
      });
    };

 };

window.CanvasMorpher = CanvasMorpher;
