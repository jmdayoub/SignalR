import React, { useState, useEffect } from "react";
import { Row, Col, Image, Card } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import SimpleBar from "simplebar-react";
import PropTypes from "prop-types";
import messageServices from "services/messageService";
import debug from "sabio-debug";
import toastr from "toastr";

const _logger = debug.extend("Chatbox");

const ChatBox = ({ currentUser, messages, recipientId }) => {
  _logger("messages on chatbox", messages);

  const [message, setMessage] = useState({
    message: "",
    subject: "",
    recipientId: "",
    senderId: currentUser.id,
  });

  const [convo, setConvo] = useState([]);
  useEffect(() => {
    if (recipientId) {
      setMessage((prevState) => {
        return { ...prevState, recipientId: recipientId };
      });
    }
  }, [recipientId]);

  useEffect(() => {
    _logger("LEFEBA");
    setConvo(messages.map(mapMessage));
  }, [messages, recipientId]);

  _logger("recipientId", recipientId);

  const onSendClicked = (values) => {
    _logger("SendMessageClicked", values);

    messageServices
      .addMessage(values)
      .then(onSendMessageSuccess)
      .catch(onSendMessageError);
  };

  const onSendMessageSuccess = (response) => {
    _logger("sendMessageSuccess", response);

    toastr["success"]("Message sent", "Sent");
  };

  const onSendMessageError = (error) => {
    _logger("sendMessageError", error);
  };

  false && _logger(messages);

  const mapMessage = (message) => {
    _logger("Mapping message", message);
    let chatClass = "";
    let divClass = "";
    if (message.recipientId === currentUser.id) {
      chatClass = "chat-item d-inline-block mx-2";
      divClass = "chat-item d-flex justify-content-end my-3";
    } else {
      chatClass = "chat-item d-inline-block mx-2";
    }

    return (
      <div key={"MessageList-" + message.id} className={divClass}>
        <div className={chatClass}>
          <div className="my-1 avatar avatar-md avatar-indicators avatar-online">
            <Image
              src={message.sender.avatarUrl}
              alt="recipient"
              className="rounded-circle"
            />
          </div>
          <div className={chatClass}>
            {message.sender.firstName} {message.sender.lastName}
          </div>
          <div>{message.messageText}</div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="messages-container position-relative px-0 pb-0 mx-3">
        <SimpleBar className="d-block my-2 mx-2 vh-100">
          {convo ? convo : "Nothing to see here"}
        </SimpleBar>
        <Row className="px-3 pb-3">
          <Col>
            <div className="mt-2 bg-light p-3 rounded">
              <Formik
                enableReinitialize={true}
                initialValues={message}
                onSubmit={onSendClicked}
              >
                <Form noValidate name="chat-form" id="chat-form">
                  <div className="row">
                    <div className="col mb-2 mb-sm-0">
                      <Field
                        type="text"
                        name="message"
                        className="form-control textarea"
                        placeholder="Enter your message"
                      />
                    </div>
                    <div className="col-sm-auto">
                      <div className="btn-group">
                        <button
                          type="submit"
                          className="btn btn-success chat-send btn-block"
                          key="newMessageSend"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};
export default ChatBox;

ChatBox.propTypes = {
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
  recipientId: PropTypes.string.isRequired,
};
