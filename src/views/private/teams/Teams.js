import React from 'react';
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Button,
  UncontrolledTooltip,
} from 'reactstrap';

const Teams = props => (
  <div className="max-w-xl m-auto">
    <Container className="my-4">
      <div className="flex items-center mb-2 justify-between">
        <h1 className="text-lg mb-0">
          My Teams{' '}
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
          Create and manage Teams here. Invite users to join your team
          and participate in teams.
        </UncontrolledTooltip>
        <div>
          <Button
            size="sm"
            color="secondary"
            className="mr-2"
            onClick={props.toggleModal.bind(this, 'modalJoin')}
          >
            Join
          </Button>
          <Button
            size="sm"
            color="primary"
            onClick={props.toggleModal.bind(this, 'modalAdd')}
          >
            Add
          </Button>
        </div>
      </div>
      <Card>
        <CardBody className="p-2">
          <CardTitle>Card title</CardTitle>
        </CardBody>
      </Card>
    </Container>
  </div>
);

export default Teams;
