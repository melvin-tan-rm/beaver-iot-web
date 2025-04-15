import { useCallback } from 'react';
import {
    HttpCurlDialog,
    HttpCurlInfo,
    HttpOutputInfo,
    ParamsList,
    type HttpOutputInfoProps,
    type ParamsListProps,
} from '../components';

interface RenderFunctionProps {
    /**
     * Current Node
     */
    node?: WorkflowNode;

    /**
     * The name of the form group
     */
    formGroupName?: string;

    /**
     * The index of the form group in the form group list
     */
    formGroupIndex?: number;

    /**
     * Current Form Data
     */
    data?: Record<string, any>;
}

interface RenderActionProps extends RenderFunctionProps {
    /**
     * Callback when the form data changes
     */
    onChange: (data: Record<string, any>) => void;
}

type RenderGroupProps = Pick<RenderFunctionProps, 'node' | 'data'>;

const useExtraRender = () => {
    /**
     * Render Form group action in the form group header
     */
    const renderFormGroupAction = useCallback(
        ({ node, formGroupIndex, onChange }: RenderActionProps) => {
            switch (node?.type) {
                case 'http': {
                    if (formGroupIndex === 0) {
                        return <HttpCurlDialog onChange={onChange} />;
                    }
                    break;
                }
                default: {
                    break;
                }
            }

            return null;
        },
        [],
    );

    /**
     * Render extra content in the form group body
     */
    const renderFormGroupContent = useCallback(
        ({ node, formGroupName, data }: RenderFunctionProps) => {
            switch (node?.type) {
                case 'httpin': {
                    if (formGroupName === 'Setting') {
                        return <HttpCurlInfo data={data} />;
                    }
                    break;
                }
                default: {
                    break;
                }
            }

            return null;
        },
        [],
    );

    /**
     * Render extra form group in the end of group list
     */
    const renderFormGroupFooter = useCallback(({ node, data }: RenderGroupProps) => {
        switch (node?.type) {
            case 'http': {
                const options: HttpOutputInfoProps['options'] = [
                    {
                        name: 'header',
                        type: 'object',
                        placeholder: 'Response Header',
                    },
                    {
                        name: 'body',
                        type: 'object',
                        placeholder: 'Response Content',
                    },
                    {
                        name: 'status_code',
                        type: 'long',
                        placeholder: 'Response code',
                    },
                ];
                return <HttpOutputInfo title="Output Variables" options={options} />;
            }
            case 'mqtt': {
                const paramsOptions: ParamsListProps['options'] = [
                    {
                        label: 'Broker Address',
                        value: 'https://exampleaddress,https://exampleaddress,https://exampleaddress',
                    },
                    {
                        label: 'Broker Port',
                        value: '8080',
                    },
                    {
                        label: 'Client ID',
                        value: 'dj1wioj231ahu43jhoi',
                    },
                    {
                        label: 'Username',
                        value: 'example@tenatid',
                    },
                    {
                        label: 'Password',
                        value: 'S86yd5dY612312',
                        type: 'password',
                    },
                ];
                const outputOptions: HttpOutputInfoProps['options'] = [
                    {
                        name: 'Topic',
                        type: 'object',
                        placeholder: 'Topic of the message',
                    },
                    {
                        name: 'Payload',
                        type: 'object',
                        placeholder: 'Load content of message',
                    },
                ];
                return (
                    <>
                        <ParamsList title="Connection parameters" options={paramsOptions} />
                        <HttpOutputInfo title="Output Variables" options={outputOptions} />
                    </>
                );
            }
            default: {
                break;
            }
        }

        return null;
    }, []);

    return {
        /**
         * Render Form group action in the form group header
         */
        renderFormGroupAction,

        /**
         * Render extra content in the form group body
         */
        renderFormGroupContent,

        /**
         * Render extra form group in the end of group list
         */
        renderFormGroupFooter,
    };
};

export default useExtraRender;
