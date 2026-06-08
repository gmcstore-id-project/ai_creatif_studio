import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface GenerationProgressProps {
  status: "idle" | "uploading" | "processing" | "completed" | "failed";
  progress: number;
  error?: string | null;
  resultUrl?: string | null;
  contentType?: "image" | "video";
  onDownload?: () => void;
  onReset?: () => void;
}

export default function GenerationProgress({
  status,
  progress,
  error,
  resultUrl,
  contentType = "image",
  onDownload,
  onReset,
}: GenerationProgressProps) {
  if (status === "idle") {
    return null;
  }

  const getStatusLabel = () => {
    switch (status) {
      case "uploading":
        return "Uploading files...";
      case "processing":
        return "Processing with AI...";
      case "completed":
        return "Generation complete!";
      case "failed":
        return "Generation failed";
      default:
        return "Processing...";
    }
  };

  const getEstimatedTime = () => {
    if (status === "uploading") return "~30 seconds";
    if (status === "processing") {
      if (progress < 30) return "~2-3 minutes";
      if (progress < 60) return "~1-2 minutes";
      return "~30 seconds";
    }
    return "Complete";
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === "completed" ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : status === "failed" ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          )}
          {getStatusLabel()}
        </CardTitle>
        <CardDescription>
          {status !== "completed" && status !== "failed" && (
            <span>Estimated time remaining: {getEstimatedTime()}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {status !== "completed" && status !== "failed" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Error Message */}
        {status === "failed" && error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Success Message with Preview */}
        {status === "completed" && (
          <div className="space-y-3">
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3">
              <p className="text-sm text-green-500">Your content is ready!</p>
            </div>

            {/* Content Preview */}
            {resultUrl ? (
              <div className="relative bg-black rounded-lg overflow-hidden h-64 flex items-center justify-center">
                {contentType === "video" ? (
                  <video
                    src={resultUrl}
                    controls
                    className="w-full h-full object-contain"
                    autoPlay
                  />
                ) : (
                  <img
                    src={resultUrl}
                    alt="Generated content"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Image failed to load:", resultUrl);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="relative bg-black rounded-lg overflow-hidden h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">Preview not available</p>
                  <p className="text-xs mt-1">File is ready for download</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={onDownload}
                className="flex-1 gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                onClick={onReset}
                variant="outline"
                className="flex-1"
              >
                Create Another
              </Button>
            </div>
          </div>
        )}

        {/* Retry Button for Failed */}
        {status === "failed" && (
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full"
          >
            Try Again
          </Button>
        )}

        {/* Status Details */}
        {status !== "completed" && status !== "failed" && (
          <div className="bg-accent/20 border border-accent/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold">Status Details</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• {status === "uploading" ? "Uploading your files" : "Processing with AI models"}</p>
              <p>• Please keep this window open</p>
              <p>• Do not refresh the page</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
