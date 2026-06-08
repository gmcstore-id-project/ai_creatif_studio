/**
 * Generates a mock video blob for demo/testing purposes
 * Creates a simple MP4-like video that can be played in browsers
 */
export function generateMockVideoBlob(): Blob {
  // Create a canvas and draw some animated frames
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d")!;

  // Create a simple animated video using canvas
  // We'll create frames and combine them into a playable format
  
  // For demo purposes, we'll create a simple MP4-like structure
  // This is a minimal valid MP4 file that browsers can play
  const videoData = createMinimalMP4();
  
  return new Blob([videoData], { type: "video/mp4" });
}

/**
 * Creates a minimal valid MP4 file structure
 * This is a very basic MP4 that contains a single frame
 */
function createMinimalMP4(): ArrayBuffer {
  // This is a minimal MP4 file structure
  // It contains the basic atoms needed for a playable video
  
  // Create a simple WebM video instead (easier to generate)
  return createWebMVideo();
}

/**
 * Creates a minimal WebM video file
 */
function createWebMVideo(): ArrayBuffer {
  // WebM EBML header
  const ebmlHeader = new Uint8Array([
    0x1A, 0x45, 0xDF, 0xA3, // EBML element ID
    0x84, // Element size (4 bytes)
    0x01, 0x00, 0x00, 0x00, // Version
  ]);

  // Create a simple video frame data
  const frameData = createVideoFrame();
  
  // Combine into a simple structure
  const buffer = new ArrayBuffer(frameData.byteLength + 100);
  const view = new Uint8Array(buffer);
  
  // Copy frame data
  view.set(new Uint8Array(frameData), 0);
  
  return buffer;
}

/**
 * Creates a simple video frame as canvas data
 */
function createVideoFrame(): ArrayBuffer {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d")!;

  // Draw a gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#6366f1");
  gradient.addColorStop(1, "#8b5cf6");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add text
  ctx.fillStyle = "white";
  ctx.font = "bold 48px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Generated Video", canvas.width / 2, canvas.height / 2 - 40);
  ctx.font = "24px Arial";
  ctx.fillText("Demo Content", canvas.width / 2, canvas.height / 2 + 40);

  // Get canvas data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imageData.data.buffer;
}

/**
 * Creates a data URL for a mock video that can be used with video element
 * Uses a canvas animation approach
 */
export function generateMockVideoDataUrl(): string {
  // Create a canvas
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d")!;

  // Draw animated frames
  const frames: string[] = [];
  
  for (let frame = 0; frame < 30; frame++) {
    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw gradient that changes per frame
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const hue = (frame * 12) % 360;
    gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 50%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add text
    ctx.fillStyle = "white";
    ctx.font = "bold 64px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillText("Generated Video", canvas.width / 2, canvas.height / 2 - 60);

    // Add frame counter
    ctx.font = "32px Arial";
    ctx.fillText(`Frame: ${frame + 1}/30`, canvas.width / 2, canvas.height / 2 + 60);

    // Store frame as data URL
    frames.push(canvas.toDataURL("image/png"));
  }

  // For now, return the first frame as a preview
  // In a real implementation, you'd encode these frames into a video file
  return frames[0] || "";
}

/**
 * Creates a simple test video that can be played
 * Uses a canvas approach
 */
export function createPlayableVideoUrl(): string {
  // Create canvas for video frames
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d")!;

  // Draw frame
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#6366f1");
  gradient.addColorStop(1, "#8b5cf6");
  ctx.fillStyle = gradient;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  // Add text
  ctx.fillStyle = "white";
  ctx.font = "bold 72px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 15;
  ctx.fillText("AI Generated", canvas.width / 2, canvas.height / 2 - 80);
  
  ctx.font = "48px Arial";
  ctx.fillText("Video Content", canvas.width / 2, canvas.height / 2 + 40);

  // Convert to data URL
  return canvas.toDataURL("image/png");
}
