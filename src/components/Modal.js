import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal as ModalWrapper, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

export function Modal (props) {
  const {
    toggle, isOpen, title, header, body, footer,
  } = props;

  return (
    <ModalWrapper
      isOpen={ isOpen }
      toggle={ toggle }
    >
      {header && (
        <ModalHeader toggle={ toggle }>
          <>{title}</>
        </ModalHeader>
      )}
      {body && (
        <ModalBody>
          <>{body}</>
        </ModalBody>
      )}
      {footer && (
        <ModalFooter>
          <>{footer}</>
        </ModalFooter>
      )}
    </ModalWrapper>
  );
}

Modal.propTypes = {
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  header: PropTypes.bool,
  body: PropTypes.oneOfType([PropTypes.node, PropTypes.array, PropTypes.func]),
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.array, PropTypes.func]),
};
