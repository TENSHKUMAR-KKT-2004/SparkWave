import React, { useRef, useEffect } from 'react';

const VoiceWaveVisualizer = ({ audioContext, audioStream }) => {
  const canvasRef = useRef(null);
  const barWidth = 5;
  const barSpacing = 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const source = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

      const barCount = Math.min(bufferLength, canvasWidth / (barWidth + barSpacing));

      for (let i = 0; i < barCount; i++) {
        const barHeight = dataArray[i] / 2;
        const x = i * (barWidth + barSpacing);

        canvasCtx.fillStyle = 'rgba(0, 255, 0, 0.7)';
        canvasCtx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);
      }
    };

    draw();

    return () => {
      source.disconnect();
      analyser.disconnect();
    };
  }, [audioContext, audioStream]);

  return (
    <canvas
      ref={canvasRef}
      width="500"
      height="200"
      style={{ border: '2px solid #fff', backgroundColor: '#000' }}
    />
  );
};

export default VoiceWaveVisualizer;
