import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Paper, Popper, PopperProps } from '@mui/material';
import { useVirtualList } from 'ahooks';
import EntityOption from '../entity-option';
import { EntityContext } from '../../context';
import type { EntitySelectOption } from '../../types';
import './style.less';

export interface IProps extends PopperProps {
    menuList: EntitySelectOption[];
}
const LINE_HEIGHT = 58;
export default React.memo(({ menuList, ...props }: IProps) => {
    const { selectedEntityMap, maxCount } = useContext(EntityContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    /** virtual list */
    const [virtualList, scrollTo] = useVirtualList(menuList, {
        containerTarget: containerRef,
        wrapperTarget: listRef,
        itemHeight: LINE_HEIGHT,
        overscan: 10,
    });
    useEffect(() => {
        scrollTo(0);
    }, [menuList]);

    const selectedCount = useMemo(() => selectedEntityMap.size, [selectedEntityMap]);
    return (
        <Popper placement="right" {...props} className="ms-entity-menu-popper">
            <Paper className="ms-entity-menu-paper">
                <div
                    ref={containerRef}
                    className="ms-entity-menu-paper__list"
                    style={{ height: Math.min(menuList.length, 6) * LINE_HEIGHT }}
                >
                    <div ref={listRef}>
                        {(virtualList || []).map(({ data: menu }) => {
                            const { value } = menu || {};
                            const selected = selectedEntityMap.has(value);
                            const disabled =
                                maxCount && selectedCount >= maxCount ? !selected : false;

                            return (
                                <EntityOption
                                    option={menu}
                                    selected={selected}
                                    disabled={disabled}
                                />
                            );
                        })}
                    </div>
                </div>
            </Paper>
        </Popper>
    );
});
