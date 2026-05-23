
import { useState, useEffect } from "react";
import API_URL from "../utilis/api";

const usepublicData = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/public/stats`); // no token
      const data = await res.json();
      console.log("Fetched public stats:", data);
      setStats(data.stats);
    } catch (err) {
      console.error("fetchStats error:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

 return { stats, activities, loadingStats };
};

export default usepublicData;
