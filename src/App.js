import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, BrowserRouter, Link, Links } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LinksPage from "./pages/Links";
import Settings from "./pages/Settings";
import NewLinkForm from "./pages/NewLinkForm";
import ClickLogsTable from "./pages/NewAnalytics";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/linkspage" element={<LinksPage/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/newlink" element={<NewLinkForm/>} />
        <Route path="/analytics" element={<ClickLogsTable/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
