import React from 'react';
import cls from 'classnames';
import { Popper, PopperProps } from '@mui/material';
import type { EntitySelectInnerProps } from '../../types';

type IProps = PopperProps & Pick<EntitySelectInnerProps, 'popperWidth'>;
export default React.memo(({ className, style, popperWidth, ...props }: IProps) => {
    const newStyle = popperWidth ? { ...style, width: popperWidth } : style;

    return (
        <Popper {...props} className={cls('ms-entity-select-popper', className)} style={newStyle} />
    );
});
