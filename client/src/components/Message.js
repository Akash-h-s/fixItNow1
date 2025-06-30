import React, { useState } from 'react';
import axios from 'axios';

const Message = ({ senderId, receiverId, onClose }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/messages', {
        senderId,
        receiverId,
        content,
      });

      setStatus('Message sent!');
      setContent('');
    } catch (error) {
      console.error('Failed to send message:', error.response?.data || error.message);
      setStatus('Failed to send message.');
    }
  };
console.log('Message component props:', { senderId, receiverId });

  return (
    <div className="message-popup">
      <textarea
        placeholder="Type your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={onClose}>Close</button>
      <p>{status}</p>
    </div>
  );
};

export default Message;
