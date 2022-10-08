import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Image, Form, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import messageServices from "services/messageService";

const _logger = debug.extend("Sidebar");

const Sidebar = ({ messages, currentUser, cardClicked }) => {
  const [usersInConvos, setUsersInConvos] = useState({
    arrayOfUsers: [],
    userComponents: [],
  });

  useEffect(() => {
    _logger("useEffect for sidebar");
    messageServices
      .getUsersInConvos()
      .then(getUsersInConvosSuccess)
      .catch(getUsersInConvosError);
  }, []);

  const getUsersInConvosSuccess = (response) => {
    _logger("getUsersInConvos Success", response.items);
    let arrOfUsrs = response.items;
    setUsersInConvos((prevState) => {
      const ud = { ...prevState };
      ud.arrayOfUsers = arrOfUsrs.map(mapUser);
      return ud;
    });
  };

  const getUsersInConvosError = (error) => {
    _logger("getUsersInConvos Error", error);
  };

  const UserSettingMenu = () => {
    return <h6>Placeholder for settings</h6>;
  };

  false && _logger(messages);

  const onCardClicked = (e) => {
    cardClicked(e.target.id);
  };

  const mapUser = (user) => {
    _logger("Mapping user", user);
    _logger("state", usersInConvos);
    if (user.id !== currentUser.id) {
      return (
        <Row className="my-4" key={"UserList-" + user.id}>
          <Card className="chat-item">
            <div>
              <Card.Body id={user.id} name={user.id} onClick={onCardClicked}>
                <Image
                  src={user.avatarUrl}
                  alt="recipient"
                  className="mx-1 rounded-circle my-1 avatar avatar-md avatar-indicators avatar-online"
                />
                {user.firstName} {user.lastName}
              </Card.Body>
            </div>
          </Card>
        </Row>
      );
    }
  };

  return (
    <div className="bg-white border-end border-top vh-100">
      <div className="chat-window">
        <div className="chat-sticky-header sticky-top bg-white">
          <div className="px-4 pt-3 pb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-0 fw-bold h2">Chat</h1>
              </div>
              <div className="d-flex">
                <Link
                  to="#"
                  className="btn-primary rounded-circle icon-shape icon-md texttooltip me-1"
                >
                  <i className="fe fe-edit"></i>
                  <div id="newchat" className="d-none">
                    <span>New Chat</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="mt-4 mb-4">
              <Form.Control
                type="search"
                className="form-control form-control-sm"
                placeholder="Search people, group and messages"
              />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Link to="#" className="text-link">
                <div className="d-flex">
                  <div className="avatar avatar-md avatar-indicators avatar-online">
                    <Image
                      src="https://images.unsplash.com/photo-1470422862902-688c1ae73e86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTgwOTN8MHwxfHNlYXJjaHw3fHxob3JzZSUyMGF2YXRhcnxlbnwwfHx8fDE2NjQ0ODEyMTA&ixlib=rb-1.2.1&q=80&w=1080"
                      alt=""
                      className="rounded-circle"
                    />
                  </div>
                  <div className=" ms-2">
                    <h5 className="mb-0">mivet1</h5>
                    <p className="mb-0 text-muted">Online</p>
                  </div>
                </div>
              </Link>
              <UserSettingMenu />
            </div>
            <Col>{usersInConvos.arrayOfUsers}</Col>
          </div>
          <Row>
            <Col lg={12} md={12} sm={12}></Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

Sidebar.propTypes = {
  cardClicked: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      recipientId: PropTypes.number.isRequired,
      senderId: PropTypes.number.isRequired,
      recipient: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired,
      }),
      sender: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired,
      }),
    })
  ),
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};
