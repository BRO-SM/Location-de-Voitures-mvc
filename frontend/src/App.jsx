// src/App.jsx

import RoutesConfig from "./RoutesConfig";

import NavBar from "./pages/NavBar";
import Footer from "./pages/Footer";

function App() {
  return (
    <div>
      <NavBar />
      <RoutesConfig />
      <Footer />
    </div>
  );
}

export default App;
