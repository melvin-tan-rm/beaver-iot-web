import { useMemo } from 'react';
import type { Klass, LexicalNode } from 'lexical';

import { TableNodes, HeadingNode } from '../nodes';
import { NAMESPACE } from '../constant';
import { EditorTheme } from '../themes';

/**
 * editor global configuration
 */
export const useEditConfigure = () => {
    return useMemo(() => {
        return {
            namespace: NAMESPACE,
            nodes: [...TableNodes, HeadingNode] as Array<Klass<LexicalNode>>,
            onError(error: Error) {
                throw error;
            },
            theme: EditorTheme,
        };
    }, []);
};
