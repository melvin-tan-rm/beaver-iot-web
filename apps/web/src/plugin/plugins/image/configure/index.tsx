import { forwardRef, useEffect } from 'react';
import { RenderConfig } from '../../../render';
import useFormData from './useFormData';

interface ConfigPluginProps {
    config: CustomComponentProps;
    value: any;
    onOk: (data: any) => void;
    onChange: (data: any) => void;
}

const Plugin = forwardRef((props: ConfigPluginProps, ref: any) => {
    const { onOk, onChange, value, config } = props;
    const [resultValue, resultConfig] = useFormData(value, config);

    // console.log({ value, resultValue, resultConfig, ref });
    const handleSubmit = (data: any) => {
        onOk(data);
    };

    useEffect(() => {
        const setValue = ref?.current?.setValue;
        if (!setValue || resultValue.dataType !== 'url') return;

        // Hack: Reset the url value to fix the validate error
        setValue('url', resultValue.url);
    }, [resultValue, ref]);

    return (
        <RenderConfig
            config={resultConfig}
            onOk={handleSubmit}
            ref={ref}
            onChange={onChange}
            value={resultValue}
        />
    );
});

export default Plugin;
