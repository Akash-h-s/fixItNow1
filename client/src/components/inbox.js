import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [workerId, setWorkerId] = useState(null);

  useEffect(() => {
    const loggedInWorker = JSON.parse(localStorage.getItem('user'));
    if (loggedInWorker) {
      setWorkerId(loggedInWorker._id);
    }
  }, []);

  useEffect(() => {
    if (workerId) {
      axios.get(`http://localhost:5000/api/messages/inbox/${workerId}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error(err));
    }
  }, [workerId]);

  return (
    <div>
      <h2>Inbox</h2>
      {messages.map((msg, index) => (
        <div key={index}>
          <p><strong>From:</strong> {msg.senderId?.name} ({msg.senderId?.email})</p>
          <p>{msg.content}</p>
          <p><i>{new Date(msg.timestamp).toLocaleString()}</i></p>
        </div>
      ))}
    </div>
  );
};

export default Inbox;
