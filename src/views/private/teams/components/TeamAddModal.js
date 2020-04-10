import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import toastr from 'toastr';
import { withFirebase } from '../../../../components/Firebase';
import { getChallenges } from '../../../../services/api/challenges';
import TeamModel from '../../../../models/team';

class TeamAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team: new TeamModel(),
      challenge: {},
      challenges: [],
      selectedChallenges: [],
    };
  }

  componentDidMount() {
    console.log(this.props);
    this._loadTeam();
    this._getChallenges();
  }

  _loadTeam() {
    console.log(this.props);
    if (this.props.team && this.props.team.id) {
      this.setState({ team: this.props.team });
    }
  }

  _getChallenges = () => {
    getChallenges(this.props.firebase, this.props.user.uid).then(
      res => {
        this.setState({ challenges: res });
      },
    );
  };

  _handleChange = e => {
    let team = this.state.team;
    team[e.target.name] = e.target.value;
    this.setState({ team });
  };

  _handleSelectChange = e => {
    // this._addChallenge(e.target.value);
  };

  _submitForm = e => {
    e.preventDefault();

    if (this.state.team.id) {
      this._updateTeam();
      return;
    }

    this.props.firebase
      .teams()
      .add({
        ...this.state.team,
        ...{
          userId: this.props.user.uid,
          updatedAt: this.props.firebase.fieldValue.serverTimestamp(),
          createdAt: this.props.firebase.fieldValue.serverTimestamp(),
        },
      })
      .then(res => {
        toastr.success('Team saved successfully', {
          timeOut: 5000,
        });
        this.props.modalResponse({
          result: 'success',
          data: res,
        });
      })
      .catch(err => {
        toastr.success('There was a problem saving your team', {
          timeOut: 5000,
        });
        console.log(err);
      });
  };

  _updateTeam() {
    // let team = {
    //   ...this.state.team,
    //   ...{
    //     updatedAt: this.props.firebase.fieldValue.serverTimestamp(),
    //   },
    // };
  }

  render() {
    let challenges = this.state.challenges.map(challenge => (
      <option key={challenge.id} value={challenge.id}>
        {challenge.name}
      </option>
    ));

    let selectedChallenges = this.state.selectedChallenges.map(
      challenge => (
        <li
          key={challenge.id}
          className="list-group-item flex items-center justify-between hover:bg-grey-lighter"
        >
          {challenge.name}
          <span onClick={this._removeChallenge.bind(this, challenge)}>
            <i className="fa fa-times text-3xl text-red cursor-pointer ml-2" />
          </span>
        </li>
      ),
    );

    return (
      <Modal
        isOpen={this.props.modal}
        toggle={this.props.toggleModal}
        className={this.props.className}
      >
        <form onSubmit={event => this._submitForm}>
          <ModalHeader toggle={this.props.toggleModal}>
            Team
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label className="leading-tight">Name</label>
              <input
                type="text"
                name="name"
                className="form-control form-control-sm"
                value={this.state.team.name}
                required
                onChange={this._handleChange}
              />
            </div>
            <div className="form-group">
              <label className="leading-tight">Description</label>
              <textarea
                name="description"
                rows="3"
                className="form-control form-control-sm"
                value={this.state.team.description}
                onChange={this._handleChange}
              />
            </div>
            <div className="form-group">
              <label className="leading-tight">Challenges</label>
              <select
                name="challenges"
                className="form-control"
                value={this.state.challenge}
                onChange={this._handleSelectChange}
              >
                <option value="">Assign to challenge(s)</option>
                {challenges}
              </select>
            </div>
            <div className="form-group">
              <ul className="list-group">{selectedChallenges}</ul>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              size="sm"
              onClick={this.props.toggleModal}
            >
              Cancel
            </Button>
            <button className="btn btn-primary btn-sm" type="submit">
              {this.props.team && this.props.team.id
                ? 'Save Changes'
                : 'Create'}
            </button>{' '}
          </ModalFooter>
        </form>
      </Modal>
    );
  }
}

export default withFirebase(TeamAddModal);
