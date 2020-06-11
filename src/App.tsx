import React from 'react';
import BoardgamesList from './components/BoardgamesList/BoardgamesList';
import './App.scss';
import SideBar from './components/Sidebar/Sidebar';

function App() {
  return (
    <div className="app">
      <SideBar />
      <div className="header-container" />
      <div className="content-container"><BoardgamesList /></div>
    </div>
  );
}

export default App;
