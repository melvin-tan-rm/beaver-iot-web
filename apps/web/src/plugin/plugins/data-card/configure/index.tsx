import { forwardRef, useMemo } from 'react';
import { useActivityEntity } from '@/plugin/hooks';
import { RenderConfig } from '../../../render';
import { useConnect } from '../runtime';
import type { ConfigureType, ViewConfigProps } from '../typings';

interface ConfigPluginProps {
    value: ViewConfigProps;
    config: ConfigureType;
    onOk: (data: ViewConfigProps) => void;
    onChange: (data: ViewConfigProps) => void;
}
const Plugin = forwardRef((props: ConfigPluginProps, ref: any) => {
    const { value, config, onOk, onChange } = props;
    const { getLatestEntityDetail } = useActivityEntity();
    const latestEntity = useMemo(() => {
        if (!value.entity) return {};
        return getLatestEntityDetail(value.entity);
    }, [value.entity, getLatestEntityDetail]) as EntityOptionType;

    const { configure, handleChange } = useConnect({
        value: {
            ...value,
            entity: latestEntity,
        } as ViewConfigProps,
        config,
        onChange,
    });

    return (
        <RenderConfig
            value={value}
            config={configure}
            ref={ref}
            onOk={onOk}
            onChange={handleChange}
        />
    );
});

export default Plugin;
