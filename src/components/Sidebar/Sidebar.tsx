import React from 'react';
import './Sidebar.scss';

export default function SideBar() {
  return (
    <nav>
      <ul className="sidebar">
        <li className="app-name">BOARDGAMES</li>
        <li className="sidebar-item active">WHAT'S HOT</li>
        <li className="sidebar-item">MY COLLECTION</li>
      </ul>
    </nav>
  );
}
