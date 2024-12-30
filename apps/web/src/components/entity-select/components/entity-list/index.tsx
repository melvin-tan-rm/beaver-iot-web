import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
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
    const { tabType, options, selectedEntityMap, maxCount } = useContext(EntityContext);
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
    const selectedCount = useMemo(() => selectedEntityMap.size, [selectedEntityMap]);

    // get scroll bar width
    const scrollbarWidth = useMemo(() => {
        if (!menuAnchorEl) return 0;

        const listNode = menuAnchorEl?.parentElement?.parentElement;
        const popNode = listNode?.parentElement;
        if (!listNode || !popNode) return 0;

        const { scrollHeight, clientHeight, clientWidth } = listNode || {};
        const hasScroll = scrollHeight > clientHeight;
        if (!hasScroll) return 0;

        const { clientWidth: popClientWidth } = popNode || {};
        return popClientWidth - clientWidth || 0;
    }, [menuAnchorEl]);

    // when scroll, clear menu list
    const handleScroll = useMemoizedFn(() => {
        if (!menuList?.length) return;

        setMenuList([]);
    });
    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        node.addEventListener('scroll', handleScroll);
        return () => {
            node.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // Define popper modifiers
    const modifiers = useMemo(
        () => [
            {
                name: 'offset',
                options: {
                    offset: [0, scrollbarWidth],
                },
            },
        ],
        [scrollbarWidth],
    );
    return (
        <>
            <div {...props} ref={containerRef}>
                <div ref={listRef}>
                    {(virtualList || []).map(({ data: option }) => {
                        const { value } = option || {};
                        const selected = selectedEntityMap.has(value);
                        const disabled = maxCount && selectedCount >= maxCount ? !selected : false;

                        return tabType === 'entity' ? (
                            <EntityOption
                                key={value}
                                option={option}
                                selected={selected}
                                disabled={disabled}
                            />
                        ) : (
                            <EntityMenu key={value} option={option} onClick={handleClick} />
                        );
                    })}
                </div>
            </div>
            {tabType === 'device' && !!menuList.length && (
                <EntityMenuPopper
                    open={open}
                    anchorEl={menuAnchorEl}
                    menuList={menuList}
                    modifiers={modifiers}
                />
            )}
        </>
    );
});
