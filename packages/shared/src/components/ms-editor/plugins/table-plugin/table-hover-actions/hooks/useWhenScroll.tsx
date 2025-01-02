import { useDebounceFn } from 'ahooks';
import { useEffect } from 'react';
import { useSignalState } from '../../../../../../hooks';
import { getEditorContent } from '../../../../helper';

export const useWhenScroll = (fn: (...params: any[]) => any) => {
    const [getIsScroll, setIsScroll] = useSignalState(false);

    const { run: scrollCb } = useDebounceFn(
        async () => {
            fn?.();

            setIsScroll(false);
        },
        { wait: 100, leading: true },
    );

    useEffect(() => {
        // 滚动的时候，不显示添加按钮
        const dom = getEditorContent();
        if (!dom) return;

        const cb = () => {
            setIsScroll(true);
            scrollCb();
        };
        dom.addEventListener('scroll', cb, false);
        return () => dom.removeEventListener('scroll', cb, false);
    }, [scrollCb]);

    return {
        getIsScroll,
    };
};
