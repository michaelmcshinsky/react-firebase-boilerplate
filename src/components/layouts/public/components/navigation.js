import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase';

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  function logout() {
    firebase.signOut();
  }

  return (
    <Navbar color='dark' dark expand='md'>
      <NavbarBrand href='/'>React Firebase Starter</NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className='ml-auto' navbar>
          <NavItem>
            <Link to='/' className='nav-link' onClick={toggle}>
              Home
            </Link>
          </NavItem>
          <NavItem>
            <NavLink
              href='https://github.com/mmcshinsky/react-firebase-starter'
              target='_blank'
            >
              GitHub
            </NavLink>
          </NavItem>
          <NavItem>
            <Link to='/contact' className='nav-link' onClick={toggle}>
              Contact
            </Link>
          </NavItem>
          {!isLoaded(auth) ? null : isEmpty(auth) ? (
            <>
              <NavItem>
                <Link to='/login' className='nav-link' onClick={toggle}>
                  Login
                </Link>
              </NavItem>
              <NavItem>
                <Link to='/register' className='nav-link' onClick={toggle}>
                  Register
                </Link>
              </NavItem>
            </>
          ) : (
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                My Account
              </DropdownToggle>
              <DropdownMenu right>
                <Link to='/admin/dashboard' className='dropdown-item'>
                  Dashboard
                </Link>
                <Link to='/admin/account' className='dropdown-item'>
                  Account
                </Link>
                <DropdownItem divider />
                <DropdownItem onClick={logout}>Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
}
