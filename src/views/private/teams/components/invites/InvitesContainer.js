import React, { Component } from 'react';
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Button,
} from 'reactstrap';
import InviteModal from './components/InviteModal';

export default class InvitesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };
  }

  _toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  };

  render() {
    return (
      <React.Fragment>
        <div className="max-w-xl m-auto">
          <Container className="my-4">
            <div className="flex items-center mb-2 justify-between">
              <h1 className="text-lg mb-0">Invites</h1>
              <Button
                size="sm"
                color="primary"
                onClick={this._toggleModal}
              >
                Add Invite
              </Button>
            </div>
            <Card>
              <CardBody className="p-2">
                <CardTitle>Card title</CardTitle>
              </CardBody>
            </Card>
          </Container>
        </div>
        <InviteModal
          toggleModal={this._toggleModal}
          modal={this.state.modal}
        />
      </React.Fragment>
    );
  }
}
