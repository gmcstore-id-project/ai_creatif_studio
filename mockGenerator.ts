
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { storagePut } from "./storage";

const execAsync = promisify(exec);

export async function generateMockVideo(title: string): Promise<{ url: string; key: string }> {
  const tempDir = "/tmp/ai-studio-mocks";
  await fs.mkdir(tempDir, { recursive: true });
  const fileName = `mock_${Date.now()}.mp4`;
  const filePath = path.join(tempDir, fileName);

  // Generate a 5-second video with text using ffmpeg
  const command = `ffmpeg -f lavfi -i color=c=blue:s=1280x720:d=5 -vf "drawtext=text='${title}':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=(h-text_h)/2" -c:v libx264 -t 5 -pix_fmt yuv420p "${filePath}"`;
  
  try {
    await execAsync(command);
    const videoBuffer = await fs.readFile(filePath);
    const result = await storagePut(fileName, videoBuffer, "video/mp4");
    
    // Cleanup
    await fs.unlink(filePath);
    
    return result;
  } catch (error) {
    console.error("FFmpeg error:", error);
    // Fallback to a static URL if ffmpeg fails
    return {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      key: "fallback-video"
    };
  }
}

export async function generateMockImage(title: string): Promise<{ url: string; key: string }> {
  const tempDir = "/tmp/ai-studio-mocks";
  await fs.mkdir(tempDir, { recursive: true });
  const fileName = `mock_${Date.now()}.jpg`;
  const filePath = path.join(tempDir, fileName);

  // Generate a simple image with text using ffmpeg (since it's already there)
  const command = `ffmpeg -f lavfi -i color=c=orange:s=1280x720:d=1 -frames:v 1 -vf "drawtext=text='${title}':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=(h-text_h)/2" "${filePath}"`;

  try {
    await execAsync(command);
    const imageBuffer = await fs.readFile(filePath);
    const result = await storagePut(fileName, imageBuffer, "image/jpeg");
    
    // Cleanup
    await fs.unlink(filePath);
    
    return result;
  } catch (error) {
    console.error("FFmpeg error:", error);
    // Fallback to a static URL if ffmpeg fails
    return {
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop",
      key: "fallback-image"
    };
  }
}
