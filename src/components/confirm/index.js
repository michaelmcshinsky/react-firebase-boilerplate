import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export function Confirm(props) {
  return (
    <Modal isOpen={props.isOpen} centered style={{ maxWidth: '275px' }}>
      <ModalHeader className='border-0'>{props?.title}</ModalHeader>
      <ModalBody className='pt-0'>{props?.content}</ModalBody>
      <ModalFooter className='border-0 d-flex'>
        <Button
          outline
          color='secondary'
          className='flex-fill'
          onClick={props.cancel}
        >
          Cancel
        </Button>
        <Button color='primary' className='flex-fill' onClick={props.confirm}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
}
