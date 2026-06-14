import { useState, useRef, useEffect, useCallback } from "react";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolume1,
  FiVolumeX,
  FiMaximize,
  FiMinimize,
  FiRotateCcw,
  FiRotateCw,
} from "react-icons/fi";
import "./OrchidVideoPlayer.css";

export function OrchidVideoPlayer({ src }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => {
        console.error("Playback failed", err);
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Time Updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Seeking
  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Skip back / forward
  const skipTime = (amount) => {
    if (!videoRef.current) return;
    let newTime = videoRef.current.currentTime + amount;
    if (newTime < 0) newTime = 0;
    if (newTime > duration) newTime = duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume Changes
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const mutedState = !isMuted;
    setIsMuted(mutedState);
    videoRef.current.muted = mutedState;
    if (!mutedState && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  // Playback Rate
  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setIsSpeedMenuOpen(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Fullscreen state listener (for ESC key exits)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Controls Auto-hide trigger
  const triggerControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    triggerControlsTimeout();
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  useEffect(() => {
    triggerControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [triggerControlsTimeout]);

  // Spacebar to pause/play when focused
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle play on spacebar only when mouse is hovering the container
      if (e.code === "Space" && containerRef.current?.matches(":hover")) {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay]);

  // Formatter for time display (e.g. 02:40)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Calculate range fill percentages
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const progressBgStyle = `linear-gradient(to right, var(--crail) ${progressPercent}%, rgba(255, 255, 255, 0.2) ${progressPercent}%)`;

  const volumePercent = isMuted ? 0 : volume * 100;
  const volumeBgStyle = `linear-gradient(to right, var(--crail) ${volumePercent}%, rgba(255, 255, 255, 0.2) ${volumePercent}%)`;

  // Determine volume icon based on state
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <FiVolumeX />;
    if (volume < 0.5) return <FiVolume1 />;
    return <FiVolume2 />;
  };

  return (
    <div
      ref={containerRef}
      className={`orchid-video-container ${showControls ? "show-controls" : "hide-controls"}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        className="orchid-video-element"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        playsInline
      />

      {/* Large Center Play Overlay */}
      <div
        className={`center-play-overlay ${isPlaying ? "faded" : "visible"}`}
        onClick={togglePlay}
      >
        <button className="center-play-btn" aria-label={isPlaying ? "Pause" : "Play"}>
          <FiPlay />
        </button>
      </div>

      {/* Control Bar Overlay */}
      <div className="video-controls-bar">
        {/* Progress Timeline Row */}
        <div className="timeline-row">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="video-timeline-slider"
            style={{ background: progressBgStyle }}
            aria-label="Video Timeline"
          />
        </div>

        {/* Action Controls Row */}
        <div className="controls-action-row">
          <div className="control-group-left">
            <button
              onClick={togglePlay}
              className="control-btn play-pause-btn"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => skipTime(-10)}
              className="control-btn skip-btn"
              aria-label="Rewind 10 seconds"
            >
              <FiRotateCcw />
              <span className="skip-label">10</span>
            </button>
            <button
              onClick={() => skipTime(10)}
              className="control-btn skip-btn"
              aria-label="Forward 10 seconds"
            >
              <FiRotateCw />
              <span className="skip-label">10</span>
            </button>

            {/* Volume controls */}
            <div className="volume-control-group">
              <button
                onClick={toggleMute}
                className="control-btn volume-toggle-btn"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {getVolumeIcon()}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="video-volume-slider"
                style={{ background: volumeBgStyle }}
                aria-label="Volume"
              />
            </div>

            {/* Time display */}
            <span className="video-time-display">
              {formatTime(currentTime)} <span className="time-divider">/</span> {formatTime(duration)}
            </span>
          </div>

          <div className="control-group-right">
            {/* Speed Selector */}
            <div className="speed-selector-container">
              <button
                onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
                className="control-btn speed-btn"
                aria-label="Playback Speed"
              >
                {playbackRate === 1 ? "1.0x" : `${playbackRate}x`}
              </button>

              {isSpeedMenuOpen && (
                <div className="speed-dropdown-menu">
                  {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`speed-option-btn ${playbackRate === rate ? "active" : ""}`}
                    >
                      {rate === 1 ? "Normal" : `${rate}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="control-btn fullscreen-btn"
              aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <FiMinimize /> : <FiMaximize />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
