import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Crud from "./Crud";
import Add from "./Add";
import Edit from "./Edit";
import View from "./View";
import ArchivedUsers from './ArchivedUsers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <div className="App">
             <h1>React JS CRUD Operations</h1>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Crud />} />
          <Route path="/create" element={<Add />} />
          <Route path="/update/:id" element={<Edit />} />
          <Route path="/view/:id" element={<View />} />
          <Route path="/archive" element={<ArchivedUsers />} />
          {/* <Route path="/archive/:id" element={<ArchivedUsers />} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
