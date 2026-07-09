import React, { useEffect, useState } from 'react';
import './ScrollProgress.css';

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (scrollTop / height) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      className="scroll-progress"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}

export default ScrollProgress;
