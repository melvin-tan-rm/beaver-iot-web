import React, { useCallback, useContext, useEffect, useState } from 'react';
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

    const [menuList, setMenuList] = useState<EntitySelectOption[]>([]);
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(menuAnchorEl);

    /** When clicked, the pop-up window opens */
    const handleClick = useCallback((event: React.MouseEvent, option: EntitySelectOption) => {
        setMenuAnchorEl(event.currentTarget as HTMLDivElement);

        const { children } = option || {};
        setMenuList(children || []);
    }, []);

    useEffect(() => {
        // When the tab changes, the pop-up window is closed
        if (tabType !== 'device') {
            setMenuAnchorEl(null);
        }
    }, [tabType]);
    return (
        <>
            <div {...props}>
                {(options || []).map(option => {
                    const { value } = option || {};
                    const selected = selectedEntityMap.has(value);

                    return tabType === 'entity' ? (
                        <EntityOption key={value} option={option} selected={selected} />
                    ) : (
                        <EntityMenu key={value} option={option} onClick={handleClick} />
                    );
                })}
            </div>
            {tabType === 'device' && (
                <EntityMenuPopper open={open} anchorEl={menuAnchorEl} menuList={menuList} />
            )}
        </>
    );
});
