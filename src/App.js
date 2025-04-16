import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [alerta, setAlerta] = useState(false);
  const [chamadas, setChamadas] = useState(5);
  const [valorInicial, setValorInicial] = useState(530);
  const [incremento, setIncremento] = useState(2);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL);
    socket.on('alerta', () => {
      setAlerta(true);
      setTimeout(() => setAlerta(false), 5000);
    });
    return () => socket.disconnect();
  }, []);

  const triggerAlerta = async () => {
    await fetch(`${process.env.REACT_APP_SOCKET_URL}/api/som`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor: 530 })
    });
  };

  const triggerAlertaGradual = async () => {
    for (let i = 0; i < chamadas; i++) {
      const valor = valorInicial + i * incremento;
      await fetch(`${process.env.REACT_APP_SOCKET_URL}/api/som`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor })
      });
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo entre chamadas
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>Sistema de Alerta Hospitalar com IoT</h1>
        <hr />
      </header>

      <div className="conteudo">
        <div className="ala-wrapper">
          <img src="/ala.jpg" alt="Ala hospitalar" className="ala-img" />
          {alerta && <div className="alerta-piscando" />}
        </div>

        <div className="painel-teste">
          <h2>Área de Testes</h2>
          <button className="botao-teste" onClick={triggerAlerta}>
            Testar Alerta
          </button>

          <div className="grupo-inputs">
            <label>
              Nº de chamadas:
              <input
                type="number"
                value={chamadas}
                onChange={e => setChamadas(Number(e.target.value))}
              />
            </label>

            <label>
              Valor inicial:
              <input
                type="number"
                value={valorInicial}
                onChange={e => setValorInicial(Number(e.target.value))}
              />
            </label>

            <label>
              Incremento:
              <input
                type="number"
                value={incremento}
                onChange={e => setIncremento(Number(e.target.value))}
              />
            </label>
          </div>

          <button className="botao-teste" onClick={triggerAlertaGradual}>
            Testar Alerta Gradual
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
