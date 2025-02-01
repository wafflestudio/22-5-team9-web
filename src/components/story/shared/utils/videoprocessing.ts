import { STORY_CONSTANTS } from '../constants';

const createOffscreenCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const calculateDimensions = (videoWidth: number, videoHeight: number) => {
  const targetAspectRatio =
    STORY_CONSTANTS.MAX_WIDTH / STORY_CONSTANTS.MAX_HEIGHT;
  const videoAspectRatio = videoWidth / videoHeight;

  let width = STORY_CONSTANTS.MAX_WIDTH;
  let height = STORY_CONSTANTS.MAX_HEIGHT;

  if (videoAspectRatio > targetAspectRatio) {
    // Video is wider than target - scale based on height
    height = STORY_CONSTANTS.MAX_HEIGHT;
    width = height * videoAspectRatio;
  } else {
    // Video is taller than target - scale based on width
    width = STORY_CONSTANTS.MAX_WIDTH;
    height = width / videoAspectRatio;
  }

  return {
    width,
    height,
    x: (STORY_CONSTANTS.MAX_WIDTH - width) / 2,
    y: (STORY_CONSTANTS.MAX_HEIGHT - height) / 2,
  };
};

export const processVideo = async (file: File): Promise<string> => {
  const video = document.createElement('video');
  video.playsInline = true;
  video.muted = true;

  return new Promise<string>((resolve, reject) => {
    video.onloadedmetadata = async () => {
      try {
        if (video.duration > STORY_CONSTANTS.MAX_VIDEO_DURATION) {
          throw new Error(
            `Video must be ${STORY_CONSTANTS.MAX_VIDEO_DURATION} seconds or less`,
          );
        }

        const canvas = createOffscreenCanvas(
          STORY_CONSTANTS.MAX_WIDTH,
          STORY_CONSTANTS.MAX_HEIGHT,
        );
        const ctx = canvas.getContext('2d');
        if (ctx == null) {
          throw new Error('Failed to get canvas context');
        }

        // Start playing the video to capture the first frame
        await video.play();

        const { width, height, x, y } = calculateDimensions(
          video.videoWidth,
          video.videoHeight,
        );

        // Draw first frame with background blur
        ctx.filter = 'blur(20px)';
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, -20, -20, canvas.width + 40, canvas.height + 40);
        ctx.filter = 'none';

        // Draw main video frame
        ctx.drawImage(video, x, y, width, height);

        // Create a MediaStream from the canvas
        const stream = canvas.captureStream();

        // Set up MediaRecorder with optimal settings for stories
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 2500000, // 2.5 Mbps
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const processedBlob = new Blob(chunks, { type: 'video/webm' });
          resolve(URL.createObjectURL(processedBlob));
          video.pause();
        };

        // Process frames at 30fps
        const frameInterval = 1000 / 30;
        let startTime = performance.now();

        const processFrame = () => {
          const now = performance.now();
          const elapsed = now - startTime;

          if (elapsed >= frameInterval) {
            // Draw blur background
            ctx.filter = 'blur(20px)';
            ctx.drawImage(
              video,
              -20,
              -20,
              canvas.width + 40,
              canvas.height + 40,
            );
            ctx.filter = 'none';

            // Draw main video frame
            ctx.drawImage(video, x, y, width, height);
            startTime = now - (elapsed % frameInterval);
          }

          if (!video.ended && !video.paused) {
            requestAnimationFrame(processFrame);
          } else {
            mediaRecorder.stop();
          }
        };

        mediaRecorder.start();
        requestAnimationFrame(processFrame);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };

    video.src = URL.createObjectURL(file);
  });
};
