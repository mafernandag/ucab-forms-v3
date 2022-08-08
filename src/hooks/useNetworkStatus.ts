import { useEffect, useState } from "react";

export const useNetworkStatus = () => {
  const [status, setStatus] = useState(true);

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await fetch("/favicon.ico");
        return response.status >= 200 && response.status < 300;
      } catch (error) {
        return false;
      }
    };

    const intervalId = setInterval(async () => {
      const status = await getStatus();
      setStatus(status);
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return status ? "online" : "offline";
};
