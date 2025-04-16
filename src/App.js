import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [alerta, setAlerta] = useState(false);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL);

    socket.on('alerta', () => {
      setAlerta(true);
      setTimeout(() => setAlerta(false), 5000); // piscar por 5s
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="container">
      <div className="quarto-wrapper">
        <img src="/quarto-hospital.png" alt="Quarto de hospital" className="quarto-img" />
        {alerta && <div className="alerta-piscando" />}
      </div>
    </div>
  );
}

export default App;
