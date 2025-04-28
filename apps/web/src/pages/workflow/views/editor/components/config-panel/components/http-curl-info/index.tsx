import React, { useState, useEffect } from 'react';
import DataEditor from '../data-editor';
import { getUrlParams } from '../../../../helper';

interface Props {
    title?: string;
    data?: HttpinNodeDataType['parameters'];
    credential?: {
        username?: string;
        password?: string;
    };
}

const CURL_COMMAND_LINE_BREAK = ' \\\n';

/**
 * Generate cURL command for HTTP request and display it in a DataEditor component.
 */
const HttpCurlInfo: React.FC<Props> = ({ title, data, credential }) => {
    const [command, setCommand] = useState('');

    useEffect(() => {
        const { method, url } = data || {};

        if (!method || !url) {
            setCommand('');
            return;
        }
        const command = [`curl -X ${method} '${url}'`];
        const { username, password } = credential || {};

        // TODO: Get credential info and generate curl command
        command.push(...["-H ' '", "-d ' '"]);

        if (username && password) {
            command.push(`-u '${username}:${password}'`);
        }

        setCommand(command.join(CURL_COMMAND_LINE_BREAK));
    }, [data, credential]);

    return (
        <div className="ms-http-curl-info">
            <DataEditor
                readonly
                title={title || 'cURL'}
                lang="text"
                extendable={false}
                variableSelectable={false}
                value={command}
            />
        </div>
    );
};

export default HttpCurlInfo;
