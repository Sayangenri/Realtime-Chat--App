import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            };

            await socket.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage('');
        }
    };

    useEffect(() => {
        // Event handler functions
        const receiveMessageHandler = (data) => {
            setMessageList((list) => [...list, data]);
        };

        const userJoinedHandler = (data) => {
            // Ensure a new message is added only once
            if (!messageList.some(msg => msg.message === `${data.username} joined the chat`)) {
                setMessageList((list) => [...list, { message: `${data.username} joined the chat`, time: '', author: 'System' }]);
            }
        };

        // Attach event listeners
        socket.on('recive_message', receiveMessageHandler);
        socket.on('user_joined', userJoinedHandler);

        // Join the room when the component mounts
        socket.emit('join_room', { username, room });

        // Clean up the event listeners on component unmount
        return () => {
            socket.off('recive_message', receiveMessageHandler);
            socket.off('user_joined', userJoinedHandler);
        };
    }, [socket, username, room, messageList]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((messageContent, index) => {
                        return (
                            <div
                                key={index}
                                className="message"
                                id={username === messageContent.author ? 'you' : 'other'}
                            >
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Send...."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === 'Enter' && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;
