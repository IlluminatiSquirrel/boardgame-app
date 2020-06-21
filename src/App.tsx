import React from 'react';
import BoardgamesList from './components/BoardgamesList/BoardgamesList';
import './App.scss';
import SideBar from './components/Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';

function App() {
  return (
    <div className="app">
      <SideBar />
      <Topbar />
      <div className="content-container"><BoardgamesList /></div>
    </div>
  );
}

export default App;
