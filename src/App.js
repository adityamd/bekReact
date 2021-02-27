import './App.css';
import Routing from './Components/Route'
import {BrowserRouter as Router} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routing />
     </div>
     </Router>
  );
}

export default App;
