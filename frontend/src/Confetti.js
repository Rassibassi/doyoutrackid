import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

function Confetti() {
  const container = useRef(null);

  useEffect(() => {
    var animate = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('./Confetti.json'),
    });
    animate.setSpeed(0.7);
  }, []);
  return (
    <div ref={container} />
  );
}

export default Confetti;