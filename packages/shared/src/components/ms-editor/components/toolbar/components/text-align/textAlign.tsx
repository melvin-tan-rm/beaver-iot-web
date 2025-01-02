import React, { useMemo } from 'react';
import {
    FormatAlignCenterIcon,
    FormatAlignLeftIcon,
    FormatAlignRightIcon,
} from '../../../../../icons';
import { ToolbarPart } from '../toolbar-part';
import { useAlign } from './hooks';
import type { TextAlignItemConfig } from '../../../../types';

interface IProps {
    /** 是否禁用 */
    disabled: boolean;
    /** 控制显隐的配置 */
    items?: Required<TextAlignItemConfig>['items'];
}
export default React.memo(({ disabled, items }: IProps) => {
    const { textAlignState, onClick } = useAlign();
    const { isLeft, isCenter, isRight } = textAlignState || {};

    /** 控制组件显隐 */
    const { textAlignLeft, textAlignCenter, textAlignRight } = useMemo(() => {
        return (items || []).reduce(
            (pre, cur) => {
                const { name, visible } = cur;
                pre[name] = visible ?? true;
                return pre;
            },
            {
                textAlignLeft: true,
                textAlignCenter: true,
                textAlignRight: true,
            } as Record<Required<IProps>['items'][number]['name'], boolean>,
        );
    }, [items]);

    return (
        <>
            {textAlignLeft && (
                <ToolbarPart disabled={disabled} isActive={isLeft} onClick={() => onClick('left')}>
                    <FormatAlignLeftIcon className="ms-toolbar__icon" />
                </ToolbarPart>
            )}
            {textAlignCenter && (
                <ToolbarPart
                    disabled={disabled}
                    isActive={isCenter}
                    onClick={() => onClick('center')}
                >
                    <FormatAlignCenterIcon className="ms-toolbar__icon" />
                </ToolbarPart>
            )}
            {textAlignRight && (
                <ToolbarPart
                    disabled={disabled}
                    isActive={isRight}
                    onClick={() => onClick('right')}
                >
                    <FormatAlignRightIcon className="ms-toolbar__icon" />
                </ToolbarPart>
            )}
        </>
    );
});
