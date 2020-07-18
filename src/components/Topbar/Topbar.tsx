import React from 'react';
import './Topbar.scss';

export default function () {
  return (
    <div className="topbar">
      <div className="search-box">
        <input placeholder="Find a boardgame" />
        <i className="fas fa-search" />
      </div>
    </div>
  );
}
