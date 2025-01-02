import { useMemo } from 'react';
import { TableNodes } from '../nodes';
import { NAMESPACE } from '../constant';
import { EditorTheme } from '../themes';

/**
 * 编辑器全局配置
 */
export const useEditConfigure = () => {
    return useMemo(() => {
        return {
            namespace: NAMESPACE,
            nodes: [...TableNodes],
            onError(error: Error) {
                throw error;
            },
            theme: EditorTheme,
        };
    }, []);
};
