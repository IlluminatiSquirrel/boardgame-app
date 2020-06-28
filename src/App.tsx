import React from 'react';
import HotBoardgamesList from './components/HotBoardgamesList/HotBoardgamesList';
import './App.scss';
import SideBar from './components/Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';

function App() {
  return (
    <div className="app">
      <SideBar />
      <Topbar />
      <div className="content-container"><HotBoardgamesList /></div>
    </div>
  );
}

export default App;
