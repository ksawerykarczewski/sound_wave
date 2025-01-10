// figma.loadAllPagesAsync();
// figma.showUI(__html__, { themeColors: true })

// figma.ui.resize(400, 300);

// figma.ui.onmessage = async(pluginMessage) => {  
//   await figma.loadAllPagesAsync();

//   const waveComponentSet = figma.root.findOne(node => node.type == "COMPONENT_SET" && node.name == "wave") as ComponentSetNode;
//   const waveVariant = pluginMessage.waveVariant;
//   let selectedVariant;

//   const width = 500;
//   const height = 300;
//   const numPoints = 50;
//   const padding = 20;
//   const points: [number, number][] = [];
//   let strokeColor;

//   console.log(waveVariant);

//   switch (waveVariant) {
//     case "2":
//       selectedVariant = waveComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Type=sine");
//       // generate wave variant
//       strokeColor = { r: 1, g: 0, b: 0 }; // Red
//       break;
//     case "3":
//       selectedVariant = waveComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Type=square");
//       // generate wave 
//       strokeColor = { r: 0, g: 1, b: 0 }; // Green
//       break;
//     case "4":
//       selectedVariant = waveComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Type=sawtooth");
//       // generate wave variant
//       strokeColor = { r: 0, g: 0, b: 1 }; // Blue
//       break;
//     default:
//       selectedVariant = waveComponentSet.findOne(node => node.type == "COMPONENT" && node.name == "Type=triangle");
//       // generate wave variant
//       strokeColor = { r: 1, g: 1, b: 0 }; // Yellow
//       break;
//   }

//   if (selectedVariant) {
//     (selectedVariant as ComponentNode).createInstance();
//     // generate wave
//     for (let i = 0; i < numPoints; i++) {
//       const x = (i / (numPoints - 1)) * (width - 2 * padding) + padding;
//       let y = height / 2;
//       const t = (i / (numPoints - 1)) * Math.PI * 2;
      
//       switch (waveVariant) {
//         case '1':
//           y += Math.sin(t) * (height / 4);
//           break;
//         case '2':
//           y += (2 / Math.PI) * Math.asin(Math.sin(t)) * (height / 4);
//           break;
//         case '3':
//           y += (Math.sign(Math.sin(t)) * (height / 4));
//           break;
//         case '4':
//           y += (2 / Math.PI) * (t % (Math.PI * 2) - Math.PI) * (height / 4);
//           break;
//       }
//       points.push([x, y]);
//     }

//     const polyline = figma.createVector();

//     const vectorNetwork = {
//       vertices: points.map(([x, y]) => ({ x, y, strokeCap: 'ROUND' as StrokeCap })),
//       segments: points.map((_, i) =>
//         i < points.length - 1 ? { start: i, end: i + 1 } : null
//       ).filter(Boolean) as { start: number, end: number }[],
//     };

//     await polyline.setVectorNetworkAsync(vectorNetwork);

//     polyline.strokeWeight = 4;
//     polyline.strokes = [{ type: 'SOLID', color: strokeColor }];
//     polyline.x = 50;
//     polyline.y = 50;

//   } else {
//     figma.notify("No matching variant found");
//   }

//   figma.closePlugin();
// }

// v2
// figma.loadAllPagesAsync();
// figma.showUI(__html__, { themeColors: true });

// figma.ui.resize(400, 300);

// const waveVariants = {
//   "1": { name: "Type=triangle", strokeColor: { r: 1, g: 0, b: 0 } }, // Yellow
//   "2": { name: "Type=sine", strokeColor: { r: 1, g: 0, b: 0 } }, // Red
//   "3": { name: "Type=square", strokeColor: { r: 1, g: 0, b: 0 } }, // Green
//   "4": { name: "Type=sawtooth", strokeColor: { r: 1, g: 0, b: 0 } }, // Blue
// };

// figma.ui.onmessage = async (pluginMessage: { waveVariant: keyof typeof waveVariants }) => {
//   await figma.loadAllPagesAsync();

//   const waveComponentSet = figma.root.findOne(node => node.type == "COMPONENT_SET" && node.name == "wave") as ComponentSetNode;

//   const waveVariant = pluginMessage.waveVariant;
//   const selectedWave = waveVariants[waveVariant] || waveVariants["1"];

//   const selectedVariant = waveComponentSet.findOne(
//     (node) => node.type === "COMPONENT" && node.name === selectedWave.name
//   );

//   if (selectedVariant) {
//     (selectedVariant as ComponentNode).createInstance();
    
//     const width = 500;
//     const height = 300;
//     const numPoints = 5000;
//     const padding = 20;
//     const points: [number, number][] = [];

//     for (let i = 0; i < numPoints; i++) {
//       const x = (i / (numPoints - 1)) * (width - 2 * padding) + padding;
//       let y = height / 2;
//       const t = (i / (numPoints - 1)) * Math.PI * 2;

//       const waveFunctions = {
//         "1": () => Math.sin(t*10) * (height / 12),
//         "2": () => (2 / Math.PI) * Math.asin(Math.sin(t*10)) * (height / 4),
//         "3": () => Math.sign(Math.sin(t*10)) * (height / 4),
//         "4": () => (2 / Math.PI) * (t*10 % (Math.PI * 2) - Math.PI) * (height / 4),
//       };

//       y += waveFunctions[waveVariant] ? waveFunctions[waveVariant]() : waveFunctions["1"]();
//       points.push([x, y]);
//     }

//     const polyline = figma.createVector();
//     const vectorNetwork = {
//       vertices: points.map(([x, y]) => ({ x, y, strokeCap: "ROUND" as StrokeCap })),
//       segments: points
//         .map((_, i) => (i < points.length - 1 ? { start: i, end: i + 1 } : null))
//         .filter(Boolean) as { start: number; end: number }[],
//     };

//     await polyline.setVectorNetworkAsync(vectorNetwork);

//     polyline.strokeWeight = 4;
//     polyline.strokes = [{ type: "SOLID", color: selectedWave.strokeColor }];
//     polyline.x = 50;
//     polyline.y = 50;
//   } else {
//     figma.notify("No matching variant found");
//   }

//   figma.closePlugin();
// };

// v3
figma.loadAllPagesAsync();
figma.showUI(__html__, { themeColors: true });

figma.ui.resize(400, 300);

const waveVariants = {
  "1": { name: "Type=triangle", strokeColor: { r: 1, g: 0, b: 0 } }, // Red
  "2": { name: "Type=sine", strokeColor: { r: 1, g: 0, b: 0 } }, // Red
  "3": { name: "Type=square", strokeColor: { r: 1, g: 0, b: 0 } }, // Red
  "4": { name: "Type=sawtooth", strokeColor: { r: 1, g: 0, b: 0 } }, // Red
};

figma.ui.onmessage = async (pluginMessage: { waveVariant: keyof typeof waveVariants, audioData: string, fileName: string }) => {
  await figma.loadAllPagesAsync();

  // check filetype of pluginMessage.audioData
  // if it's a string, convert it to a Uint8Array
  // if it's a Uint8Array, use it as is
  
  let audioData: Uint8Array;
  if (typeof pluginMessage.audioData === "string") {
    audioData = new Uint8Array(pluginMessage.audioData.split(",").map((byte) => parseInt(byte)));
  } else {
    audioData = pluginMessage.audioData;
  }

  console.log(pluginMessage.audioData);
  console.log(audioData);

  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== "FRAME") {
    figma.notify("Please select a single frame to generate the wave in.");
    return;
  }

  const frame = selection[0] as FrameNode;
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = 0;
  frame.verticalPadding = 0;
  frame.horizontalPadding = 0;

  const width = frame.width - 4;
  const height = frame.height - 4;

  const waveVariant = pluginMessage.waveVariant;
  const selectedWave = waveVariants[waveVariant] || waveVariants["1"];
    
    const numPoints = 5000;
    const points: [number, number][] = [];

    for (let i = 0; i < numPoints; i++) {
      const x = (i / (numPoints - 1)) * width;
      let y = height / 2;
      const t = (i / (numPoints - 1)) * Math.PI * 2;

      // using audioData manipulate the wave
      const waveFunctions = {
        "1": () => (2 / Math.PI) * Math.asin(Math.sin(t * 10)) * (height / 4),
        "2": () => Math.sin(t * 10) * (height / 12),
        "3": () => Math.sign(Math.sin(t * 10)) * (height / 4),
        "4": () => (2 / Math.PI) * ((t * 10) % (Math.PI * 2) - Math.PI) * (height / 4),
      };

      y += waveFunctions[waveVariant] ? waveFunctions[waveVariant]() : waveFunctions["1"]();
      points.push([x, y]);
    }

    const polyline = figma.createVector();
    const vectorNetwork = {
      vertices: points.map(([x, y]) => ({ x, y, strokeCap: "ROUND" as StrokeCap })),
      segments: points
        .map((_, i) => (i < points.length - 1 ? { start: i, end: i + 1 } : null))
        .filter(Boolean) as { start: number; end: number }[],
    };

    await polyline.setVectorNetworkAsync(vectorNetwork);

    polyline.strokeWeight = 2;
    polyline.strokes = [{ type: "SOLID", color: selectedWave.strokeColor }];
    polyline.x = frame.x;
    polyline.y = frame.y;
    polyline.resize(width, height);
    frame.appendChild(polyline);

  figma.closePlugin();
};