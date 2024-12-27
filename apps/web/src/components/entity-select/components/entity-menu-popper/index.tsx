import React, { useContext } from 'react';
import { Paper, Popper, PopperProps } from '@mui/material';
import EntityOption from '../entity-option';
import { EntityContext } from '../../context';
import type { EntitySelectOption } from '../../types';
import './style.less';

export interface IProps extends PopperProps {
    menuList: EntitySelectOption[];
}
export default React.memo(({ menuList, ...props }: IProps) => {
    const { selectedEntityMap } = useContext(EntityContext);

    return (
        <Popper placement="right-start" {...props} className="ms-entity-menu-popper">
            <Paper className="ms-entity-menu-paper">
                {(menuList || []).map(menu => {
                    const { value } = menu || {};
                    const selected = selectedEntityMap.has(value);

                    return <EntityOption key={value} option={menu} selected={selected} />;
                })}
            </Paper>
        </Popper>
    );
});
