import React, {useEffect, useState, useCallback, useRef} from 'react';
import * as StompJS from '@stomp/stompjs';
import Container from './Container';

export type player = {

}

const TestContainer = () => {
    const [content, setContent] = useState("");

    const client = new StompJS.Client({
        brokerURL: 'ws://localhost:8080/ws/websocket',
        connectHeaders: {
            login: 'user',
            password: 'password',
        },
        debug: function (str) {
            console.log(str);
        },
    })

    useEffect(() => {
        client.activate();
        client.onConnect = () => {
            client.subscribe('/topic/message', (data : any) => {
                const newMessage: string = JSON.parse(data.body).message as string;
                addContent(newMessage);
            });
        }
        return () => disConnect();
    }, [content]);

    const addContent = (message: string) => {
        setContent(content.concat(message));
    }

    const handler = (message: string) => {
        if (!client.connected)
            return ;

        client.publish({
            destination : '/app/hello',
            body : JSON.stringify({
                message : message
            }),
        })
    }

    const disConnect = () => {
        if (client.connected)
            client.deactivate();
    }

    return (
        <>
            <div>
                <div id="menu">
                    <p>Welcome,
                    </p>
                </div>
                <div>
                    {content}
                </div>
                <Container sendMessage={handler}/>
            </div>
        </>
    )
}

export default TestContainer;