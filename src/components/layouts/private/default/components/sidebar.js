import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export default function Sidebar () {
  return (
    <div
      id="app-sidebar"
      className="bg-primary border-right"
    >
      <div
        id="app-sidebar-header"
        className="p-3"
      >
        <span
          role="img"
          aria-label="react"
        >
          ⚛️
        </span>
        {' '}
        <span
          role="img"
          aria-label="react"
        >
          🔥
        </span>
        {' '}
        Boilerplate
      </div>
      <Nav
        vertical
        id="app-sidebar-nav"
      >
        <NavNavItem
          to="/admin/dashboard"
          icon="tachometer-alt"
          title="Dashboard"
        />
        <NavNavItem
          to="/admin/products"
          icon="cubes"
          title="Products"
        />
        <NavNavItem
          to="/admin/posts"
          icon="user-friends"
          title="Posts"
        />
        <NavNavItem
          to="/admin/users"
          icon="user"
          title="Users"
        />
        <NavNavItem
          to="/admin/settings"
          icon="cog"
          title="Settings"
        />
      </Nav>
    </div>
  );
}

function NavNavItem ({ to, title, icon }) {
  return (
    <NavItem>
      <NavLink
        exact
        to={ to }
        className="nav-link d-flex align-items-center p-3 m-2 rounded"
      >
        <i className={ `las la-${icon} pr-3` }></i>
        {title}
      </NavLink>
    </NavItem>
  );
}

NavNavItem.propTypes = {
  to: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.string,
};
