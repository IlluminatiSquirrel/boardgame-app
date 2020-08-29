import React from 'react';
import './Sidebar.scss';
import { ActiveViewType } from '../../shared/other/custom-types';

type Props = {
  onActiveChange: (activeView: ActiveViewType) => void
  activeView: ActiveViewType
}

export default function SideBar({ onActiveChange, activeView }: Props) {
  return (
    <div className="sidebar">
      <h1 className="app-name">
        <span>BOARDGAMES</span>
        <i className="fas fa-dice" />
      </h1>
      <nav>
        <ul>
          <li>
            <button
              className={`sidebar-item ${activeView === 'hotBoardgames' ? 'active' : null}`}
              type="button"
              onClick={() => onActiveChange('hotBoardgames')}
            >
              <i className="fas fa-fire fire-icon nav-item-icon" />
              <span>WHAT'S HOT</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-item ${activeView === 'collection' ? 'active' : null}`}
              type="button"
              onClick={() => onActiveChange('collection')}
            >
              <i className="fas fa-box-open box-icon nav-item-icon" />
              <span>COLLECTION</span>
            </button>
          </li>
          <li>
            <button
              className={`sidebar-item ${activeView === 'wishlist' ? 'active' : null}`}
              type="button"
              onClick={() => onActiveChange('wishlist')}
            >
              <i className="fas fa-heart heart-icon nav-item-icon" />
              <span>WISHLIST</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
