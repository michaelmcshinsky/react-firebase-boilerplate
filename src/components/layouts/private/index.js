import React from 'react';
import Header from './components/header';
import Sidebar from './components/sidebar';

export default function PrivateLayout(props) {
  const [isHidden, setIsHidden] = React.useState(false);

  return (
    <div id='app-container' className={`d-flex bg-light${isHidden ? ' toggled' : ''}`}>
      <Sidebar />
      <div id='app-content' className='d-flex flex-column overflow-hidden'>
        <Header isHidden={isHidden} toggle={() => setIsHidden(!isHidden)} />
        <div className='flex-fill overflow-auto'>{props.children}</div>
      </div>
    </div>
  );
}
