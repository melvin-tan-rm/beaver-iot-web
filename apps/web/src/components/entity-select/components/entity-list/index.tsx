import React, { useCallback, useContext, useRef, useState } from 'react';
import { useVirtualList } from '@milesight/shared/src/hooks';
import EntityMenuPopper from '../entity-menu-popper';
import { EntityContext } from '../../context';
import EntityOption from '../entity-option';
import EntityMenu from '../entity-menu';
import type { EntitySelectOption } from '../../types';

interface IProps {
    children: React.ReactNode;
}
export default React.memo(({ children: _children, ...props }: IProps) => {
    const { tabType, options, selectedEntityMap } = useContext(EntityContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const [menuList, setMenuList] = useState<EntitySelectOption[]>([]);
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(menuAnchorEl);

    /** When clicked, the pop-up window opens */
    const handleClick = useCallback((event: React.MouseEvent, option: EntitySelectOption) => {
        setMenuAnchorEl(event.currentTarget as HTMLDivElement);

        const { children } = option || {};
        setMenuList(children || []);
    }, []);

    /** virtual list */
    const [virtualList] = useVirtualList(options, {
        containerTarget: containerRef,
        wrapperTarget: listRef,
        itemHeight: tabType === 'entity' ? 58 : 38,
        overscan: 10,
    });
    return (
        <>
            <div {...props} ref={containerRef}>
                <div ref={listRef}>
                    {(virtualList || []).map(({ data: option }) => {
                        const { value } = option || {};
                        const selected = selectedEntityMap.has(value);

                        return tabType === 'entity' ? (
                            <EntityOption key={value} option={option} selected={selected} />
                        ) : (
                            <EntityMenu key={value} option={option} onClick={handleClick} />
                        );
                    })}
                </div>
            </div>
            {tabType === 'device' && (
                <EntityMenuPopper open={open} anchorEl={menuAnchorEl} menuList={menuList} />
            )}
        </>
    );
});
