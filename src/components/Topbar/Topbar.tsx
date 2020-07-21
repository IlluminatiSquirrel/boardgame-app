import React from 'react';
import './Topbar.scss';

export default function () {
  return (
    <div className="topbar">
      <div className="search-box">
        <input type="search" placeholder="Find a boardgame" />
        <i className="fas fa-search search-icon" />
      </div>
    </div>
  );
}
