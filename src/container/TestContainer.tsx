import React, {useEffect, useState, useRef} from 'react';
import * as StompJS from '@stomp/stompjs';
import Container from './Container';
import {StompConfig} from "@stomp/stompjs";

const TestContainer = () => {
    const [content, setContent] = useState("");
    const client : any = useRef({});

    useEffect(() => {
        connect();
        return () => disConnect();
    }, []);

    const connect = () => {
        client.current = new StompJS.Client({
            brokerURL: 'ws://localhost:8080/ws/websocket',
            connectHeaders: {
                login: 'user',
                password: 'password',
            },
            onConnect: () => {
                subscribe();
            },
            debug: function (str: any) {
                console.log(str);
            },
        })

        client.current.activate();
    }

    const subscribe = () => {
        client.current.subscribe('/topic/message', (data: any) => {
            const newMessage: string = JSON.parse(data.body).message as string;
            addContent(newMessage);
        });
    }

    const addContent = (message: string) => {
        setContent(content.concat(message));
    }

    const handler = (message: string) => {
        if (!client.current.connected)
            return;

        client.current.publish({
            destination: '/draft/hello',
            body: JSON.stringify({
                message: message
            }),
        })
    }

    const disConnect = () => {
        if (client.current.connected)
            client.current.deactivate();
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