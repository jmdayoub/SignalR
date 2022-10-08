import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import messageServices from "services/messageService";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import Sidebar from "./sidebar/Sidebar";
import ChatBox from "./chatbox/ChatBox";

const _logger = debug.extend("Chatbox");

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState({
    arrayOfMessages: [],
    selectedMessages: [],
    recipientId: "",
  });

  const onCardClicked = (target) => {
    _logger("card clicked target", target);
    target = Number(target);
    const filterConvo = (convo) => {
      let result = false;
      if (target === convo.senderId || target === convo.recipientId) {
        if (
          currentUser.id === convo.senderId ||
          currentUser.id === convo.recipientId
        ) {
          result = true;
        }
        return result;
      }
    };
    setMessages((prevState) => {
      const newAr = { ...prevState };
      newAr.selectedMessages = newAr.arrayOfMessages.filter(filterConvo);
      newAr.recipientId = target;
      return newAr;
    });
  };

  useEffect(() => {
    _logger("useEffect for Chatbox");
    messageServices
      .getByConversation(currentUser.id)
      .then(getByConvoSuccess)
      .catch(getByConvoError);
  }, []);

  const getByConvoSuccess = (response) => {
    _logger("GetByConvoSuccess", response.items);
    let arrayOfMsgs = response.items;
    setMessages((prevState) => {
      const md = { ...prevState };
      md.arrayOfMessages = arrayOfMsgs;
      _logger("md", md);
      return md;
    });
  };

  const getByConvoError = (error) => {
    _logger("GetById Error=>", error);
  };

  return (
    <>
      <Row className="g-0">
        <Col xl={3} lg={12} md={12} xs={12}>
          <Sidebar
            currentUser={currentUser}
            cardClicked={onCardClicked}
          ></Sidebar>
        </Col>
        <Col xl={9} lg={12} md={12} xs={12}>
          <ChatBox
            currentUser={currentUser}
            messages={messages.selectedMessages}
            recipientId={messages.recipientId}
          />
        </Col>
      </Row>
    </>
  );
};

export default Chat;
Chat.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};
