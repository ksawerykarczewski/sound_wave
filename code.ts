figma.loadAllPagesAsync();
figma.showUI(__html__, { themeColors: true });

figma.ui.resize(400, 300);

const waveVariants = {
  "1": { name: "Type=triangle", strokeColor: { r: 1, g: 0, b: 0 } }, // Red
  "2": { name: "Type=sine", strokeColor: { r: 0, g: 1, b: 0 } }, // Green
  "3": { name: "Type=square", strokeColor: { r: 0, g: 0, b: 1 } }, // Blue
  "4": { name: "Type=sawtooth", strokeColor: { r: 1, g: 1, b: 0 } }, // Yellow
};

figma.ui.onmessage = async (pluginMessage: { 
  waveVariant: keyof typeof waveVariants, 
  audioArray: number[], 
  fileName: string 
}) => {
  await figma.loadAllPagesAsync();

  console.log("Received audio data array:", pluginMessage.audioArray);

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
  frame.verticalPadding = 10;
  frame.horizontalPadding = 10;

  const width = frame.width - 4;
  const height = frame.height - 4;

  const waveVariant = pluginMessage.waveVariant;
  const selectedWave = waveVariants[waveVariant] || waveVariants["1"];

  const targetPoints = 1000; // Ideal number of points for clarity
  const downsampleFactor = Math.max(1, Math.floor(pluginMessage.audioArray.length / targetPoints));

  // Downsampled array (pick every N-th value)
  const downsampledArray = pluginMessage.audioArray.filter((_, index) => index % downsampleFactor === 0);

  const numPoints = downsampledArray.length;
  const points: [number, number][] = [];

  for (let i = 0; i < numPoints; i++) {
    const x = (i / (numPoints - 1)) * width;
    let y = height / 2;
    
    const normalizedY = downsampledArray[i] * (height / 3); // Scale amplitude

    // Time variable for wave calculations
    const t = (i / numPoints) * Math.PI * 2;

    let modifiedY;

    switch (waveVariant) {
      case "1": // Triangle Wave (Sharper Peaks)
        modifiedY = (2 / Math.PI) * Math.asin(Math.sin(t * 8)) * normalizedY * 1.5;
        break;

      case "2": // Sine Wave (Smooth)
        modifiedY = Math.sin(t * 8) * normalizedY;
        break;

      case "3": // Square Wave (More Defined Jumps)
        modifiedY = Math.sign(Math.sin(t * 6)) * (height / 3);
        break;

      case "4": // Sawtooth Wave (Sharper Inclines)
        modifiedY = ((t * 6) % (Math.PI * 2) - Math.PI) * (normalizedY / Math.PI) * 2;
        break;

      default:
        modifiedY = normalizedY; // Default raw audio data
    }

    y += modifiedY;
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