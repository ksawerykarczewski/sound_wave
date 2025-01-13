figma.loadAllPagesAsync();
figma.showUI(__html__);
figma.ui.resize(305, 180);

const waveVariants = {
  "raw": { name: "Type=raw", strokeColor: { r: 0, g: 0, b: 1 } }, // Blue
};

figma.ui.onmessage = async (pluginMessage) => {
  await figma.loadAllPagesAsync();

  console.log("Received audio data array:", pluginMessage.audioArray);

  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== "FRAME") {
    figma.notify("Please select a single frame to generate the wave in.");
    return;
  }

  const outerFrame = selection[0];
  
  const innerFrame = figma.createFrame();
  innerFrame.layoutMode = "VERTICAL";
  innerFrame.primaryAxisSizingMode = "AUTO";
  innerFrame.counterAxisSizingMode = "AUTO";
  innerFrame.itemSpacing = 0;
  innerFrame.verticalPadding = 0;
  innerFrame.horizontalPadding = 0;
  innerFrame.resize(outerFrame.width, outerFrame.height);
  outerFrame.appendChild(innerFrame);

  const width = innerFrame.width;
  const height = innerFrame.height;

  const waveVariant = "raw"; // Hardcoded for now, can be extended later
  const selectedWave = waveVariants[waveVariant];

  const targetPoints = 1000;
  const downsampleFactor = Math.max(1, Math.floor(pluginMessage.audioArray.length / targetPoints));
  const downsampledArray = pluginMessage.audioArray.filter((_: number, index: number) => index % downsampleFactor === 0);

  const numPoints = downsampledArray.length;
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const x = (i / (numPoints - 1)) * width;
    let y = height / 2;
    
    const normalizedY = downsampledArray[i] * (height / 3);
    const t = (i / numPoints) * Math.PI * 2;
    
    const modifiedY = (2 / Math.PI) * Math.asin(Math.sin(t * 8)) * normalizedY * 1.5;
    
    y += modifiedY;
    points.push([x, y]);
  }

  const polyline = figma.createVector();
  const vectorNetwork = {
    vertices: points.map(([x, y]) => ({ x, y, strokeCap: "ROUND" as StrokeCap })),
    segments: points.map((_, i) => (i < points.length - 1 ? { start: i, end: i + 1 } : null)).filter((segment): segment is { start: number; end: number } => segment !== null),
  };

  await polyline.setVectorNetworkAsync(vectorNetwork);

  polyline.strokeWeight = 2;
  polyline.strokes = [{ type: "SOLID", color: selectedWave.strokeColor }];
  polyline.x = innerFrame.x;
  polyline.y = innerFrame.y;
  polyline.resize(width, height);
  innerFrame.appendChild(polyline);

  figma.closePlugin();
};