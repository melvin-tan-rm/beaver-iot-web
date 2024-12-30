import React, { useContext, useMemo, useRef } from 'react';
import { Paper, Popper, PopperProps } from '@mui/material';
import { useVirtualList } from '@milesight/shared/src/hooks';
import EntityOption from '../entity-option';
import { EntityContext } from '../../context';
import type { EntitySelectOption } from '../../types';
import './style.less';

export interface IProps extends PopperProps {
    menuList: EntitySelectOption[];
}
export default React.memo(({ menuList, ...props }: IProps) => {
    const { selectedEntityMap, maxCount } = useContext(EntityContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // /** virtual list */
    // const [virtualList] = useVirtualList(menuList, {
    //     containerTarget: containerRef,
    //     wrapperTarget: listRef,
    //     itemHeight: 58,
    //     overscan: 10,
    // });
    const selectedCount = useMemo(() => selectedEntityMap.size, [selectedEntityMap]);
    return (
        <Popper placement="right-start" {...props} className="ms-entity-menu-popper">
            <Paper className="ms-entity-menu-paper">
                <div ref={containerRef} className="ms-entity-menu-paper__list">
                    <div ref={listRef}>
                        {(menuList || []).map(menu => {
                            const { value } = menu || {};
                            const selected = selectedEntityMap.has(value);
                            const disabled =
                                maxCount && selectedCount >= maxCount ? !selected : false;

                            return (
                                <EntityOption
                                    key={value}
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
