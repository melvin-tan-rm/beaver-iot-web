import React, { useContext } from 'react';
import cls from 'classnames';
import { Popper, PopperProps } from '@mui/material';
import { EntityContext } from '../../context';

export default React.memo(({ className, style, ...props }: PopperProps) => {
    const { popperWidth } = useContext(EntityContext);
    const newStyle = popperWidth ? { ...style, width: popperWidth } : style;

    return (
        <Popper {...props} className={cls('ms-entity-select-popper', className)} style={newStyle} />
    );
});
