/* eslint-disable react/prop-types */
/* eslint-disable no-alert */

import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import * as helper from "../../../services/serviceHelpers";

import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import debug from "sabio-debug";
import messageServices from "services/messageService";
const _logger = debug.extend("Sidebar");

const Chats = () => {
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);

  latestChat.current = chat;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${helper.API_HOST_PREFIX}/hubs/chathub`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          _logger("Connected!", connection);

          connection.on("SendMessage", (message) => {
            _logger("Chats message", message);
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);

            setChat(updatedChat);
          });
        })
        .catch((e) => _logger("Connection failed: ", e));
    }
  }, [connection]);

  const sendMessage = async (user, message) => {
    const chatMessage = {
      recipientId: user,
      message: message,
      subject: "Test SignalR",
      dateSent: "2022-10-07",
    };

    messageServices
      .addMessage(chatMessage)
      .then(onAddMessageSuccess)
      .catch(onAddMessageError);
  };

  const onAddMessageSuccess = (response) => {
    _logger("msg success", response);
  };

  const onAddMessageError = (error) => {
    _logger("msg error", error);
  };

  return (
    <div>
      <ChatInput sendMessage={sendMessage} />
      <hr />
      <ChatWindow chat={chat} />
    </div>
  );
};

export default Chats;
