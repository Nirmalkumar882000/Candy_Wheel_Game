import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from "react-router-dom";
import './index.css'
import { SocketContext, socket } from './context/socket/socket.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SocketContext.Provider value={socket} >
    <Router>
      <App />
    </Router>
  </SocketContext.Provider>
)
