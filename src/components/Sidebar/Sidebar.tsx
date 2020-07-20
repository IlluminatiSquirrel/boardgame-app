import React from 'react';
import './Sidebar.scss';
import { ActiveViewType } from '../../shared/other/custom-types';

type Props = {
  onActiveChange: (activeView: ActiveViewType) => void
  activeView: ActiveViewType
}

export default function SideBar({ onActiveChange, activeView }: Props) {
  return (
    <nav>
      <ul className="sidebar">
        <li className="app-name">BOARDGAMES</li>
        <li>
          <button
            className={`sidebar-item ${activeView === 'hotBoardgames' ? 'active' : null}`}
            type="button"
            onClick={() => onActiveChange('hotBoardgames')}
          >
            WHAT'S HOT
          </button>
        </li>
        <li>
          <button
            className={`sidebar-item ${activeView === 'collection' ? 'active' : null}`}
            type="button"
            onClick={() => onActiveChange('collection')}
          >
            MY COLLECTION
          </button>
        </li>
      </ul>
    </nav>
  );
}
