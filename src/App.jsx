import './App.css'
import {StoreProvider} from "./store/StoreProvider.jsx";

function App() {

  return <StoreProvider>
    <h1>Home</h1>
  </StoreProvider>
}

export default App
