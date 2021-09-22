import React from 'react';
import {Link as NavLink} from "react-router-dom";
import SecurityIcon from '@mui/icons-material/Security';
import { SidebarData } from './SidebarData';

function Sidebar() {
  return (
    <div className="sidebar p-4 text-center">
      <div className="d-flex flex-row align-items-center justify-content-center">
        <SecurityIcon fontSize="large" />
        <div className="d-flex flex-column pt-3">
            <h3>EASY SCAN</h3>
            <p>For url and files</p>
        </div>
      </div>
      <div className="sidebar-content">
        {SidebarData.map((val, key) => {
          if(val.id === 3) {
            return (
              <NavLink className="btn sidebar-item" to={{ pathname: "https://bashkimdurmishi.github.io/portfolio/" }} target="_blank" rel="noopener noreferrer"> 
                <div>{val.icon}</div>
                <h4> {val.title}</h4>
              </NavLink>
            )
          }
          return (
            <NavLink className="btn sidebar-item" key={key} to={val.link}>
                <div>{val.icon}</div>
                <h4> {val.title}</h4>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;