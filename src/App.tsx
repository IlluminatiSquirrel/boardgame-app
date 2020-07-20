import React, { ReactElement, useState } from 'react';
import HotBoardgamesList from './components/HotBoardgamesList/HotBoardgamesList';
import './App.scss';
import SideBar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import CollectionList from './components/CollectionList/CollectionList';
import { ActiveViewType } from './shared/other/custom-types';

export default function App() {

  const [activeView, setActiveView] = useState<ActiveViewType>('hotBoardgames');

  function getActiveView(): ReactElement {
    if (activeView === 'hotBoardgames') {
      return <HotBoardgamesList />;
    }

    if (activeView === 'collection') {
      return <CollectionList />;
    }

    return (<div />);
  }

  function handleActiveChange(newActiveView: ActiveViewType): void {
    if (activeView !== newActiveView) {
      setActiveView(newActiveView);
    }
  }

  return (
    <div className="app">
      <SideBar activeView={activeView} onActiveChange={handleActiveChange} />
      <Topbar />
      <div className="content-container">
        {getActiveView()}
      </div>
    </div>
  );
}
