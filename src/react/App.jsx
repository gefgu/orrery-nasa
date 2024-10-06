import "./App.css";
import AppRoutes from "./Routes";
import React, { useState, useEffect } from "react";
import Loader from "./Components/Loader/loader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento ou até que os recursos sejam carregados
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Simule o tempo de carregamento

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: "100%" }}>
      {loading ? <Loader /> : <AppRoutes />}
      {/* <AppRoutes /> */}
    </div>
  );
}

export default App;
