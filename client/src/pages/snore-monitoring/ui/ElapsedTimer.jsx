import { useState, useEffect } from "react";
import { formatSecondsToTime } from "@/shared/lib/time/format";
import styles from "@/pages/snore-monitoring/ui/SnoreMonitoring.module.css";

const ElapsedTimer = ({ isRunning }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className={styles.elapsed}>
      {/* <Waves /> */}
      경과 시간
      <strong>{formatSecondsToTime(seconds)}</strong>
    </div>
  );
};

export default ElapsedTimer;
