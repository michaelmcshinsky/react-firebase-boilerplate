import React, { Component } from 'react';
import {
  Container,
  Card,
  CardBody,
  CardText,
  Button,
  UncontrolledTooltip,
} from 'reactstrap';
import { AuthUserContext } from '../../../components/Session';
import TeamAddModal from './components/TeamAddModal';
import TeamJoinModal from './components/TeamJoinModal';

export default class TeamsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddOpen: false,
      modalJoinOpen: false,
      activity: null,
    };
  }

  _toggleModal = name => {
    this.setState(prevState => ({
      [name]: !prevState[name],
    }));
  };

  _modalResponse = () => {};

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            <div className="max-w-xl m-auto">
              <Container className="my-4">
                <div className="flex items-center mb-2 justify-between">
                  <h1 className="text-lg mb-0 flex items-center">
                    My Teams
                    <span
                      id="UncontrolledTooltipExample"
                      className="text-sm pl-2"
                    >
                      <i className="fa fa-info-circle text-grey-darker" />
                    </span>
                  </h1>
                  <UncontrolledTooltip
                    placement="right"
                    target="UncontrolledTooltipExample"
                  >
                    Create and manage activities here. Assign them to your
                    challenges to be used by your participants.
                  </UncontrolledTooltip>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={this._toggleModal.bind(
                      this,
                      'modalAddOpen',
                    )}
                  >
                    Add Team
                  </Button>
                </div>
                <Card>
                  <CardBody className="p-2">
                    <CardText className="text-sm">
                      No Teams...
                    </CardText>
                  </CardBody>
                </Card>
              </Container>
            </div>
            {this.state.modalAddOpen ? (
              <TeamAddModal
                modal={this.state.modalAddOpen}
                activity={this.state.activity}
                user={authUser}
                toggleModal={this._toggleModal}
                modalResponse={this._modalResponse}
              />
            ) : null}
            {this.state.modalJoinOpen ? (
              <TeamJoinModal
                modal={this.state.modalJoinOpen}
                activity={this.state.activity}
                user={authUser}
                toggleModal={this._toggleModal}
                modalResponse={this._modalResponse}
              />
            ) : null}
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}
