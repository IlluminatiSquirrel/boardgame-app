import React from 'react';
import './Sidebar.scss';

export default function SideBar() {
  return (
    <div className="sidebar">
      <div className="app-name">BOARDGAMES</div>
      <div className="sidebar-item active">WHAT'S HOT</div>
      <div className="sidebar-item">MY COLLECTION</div>
    </div>
  );
}
