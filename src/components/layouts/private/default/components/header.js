import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFirebase } from 'react-redux-firebase';

export default function Header(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const firebase = useFirebase();
  const auth = useSelector((state) => state.firebase.auth);

  function toggle() {
    setIsOpen(!isOpen);
  }

  function logout() {
    firebase.logout();
  }

  return (
    <header id='app-header' className='border-bottom'>
      <Navbar color='light' light expand='md' className='bg-white'>
        <Button color='dark' size='sm' onClick={props.toggle}>
          <i
            className={`las la-angle-${props.isHidden ? 'right' : 'left'}`}
          ></i>
        </Button>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <Link to='/' className='nav-link'>
                <i className='las la-bell'></i>
              </Link>
            </NavItem>
            <NavItem>
              <Link to='/' className='nav-link'>
                <i className='las la-envelope'></i>
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
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {auth.email || 'My Account'}
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
          </Nav>
        </Collapse>
      </Navbar>
    </header>
  );
}
