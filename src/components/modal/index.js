import React from 'react';
import {
  Modal as ModalWrapper,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

export function Modal(props) {
  const { toggle, isOpen, title, header, body, footer } = props;

  return (
    <ModalWrapper isOpen={isOpen} toggle={toggle}>
      {header && (
        <ModalHeader toggle={toggle}>
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
