import React, { useCallback, useContext } from 'react';
import cls from 'classnames';
import { CheckIcon } from '@milesight/shared/src/components';
import Tooltip from '@/components/tooltip';
import { EntityContext } from '../../context';
import type { EntitySelectOption } from '../../types';
import './style.less';

interface IProps {
    option: EntitySelectOption;
    selected?: boolean;
    disabled?: boolean;
}
export default React.memo((props: IProps) => {
    const { onEntityChange } = useContext(EntityContext);
    const { option, selected, disabled } = props;
    const { label, description } = option || {};

    /** When an entity item is selected/canceled */
    const handleClick = useCallback(() => {
        if (disabled) return;

        onEntityChange(option);
    }, [disabled, onEntityChange, option]);

    /** when mouse down, prevent default behavior */
    const handleMouseDown = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
    }, []);
    return (
        <div
            className={cls('ms-entity-content', {
                'ms-entity-content--active': selected,
                'ms-entity-content--disabled': disabled,
            })}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
        >
            <div className="ms-entity-option">
                <div className="ms-entity-option__title">
                    <Tooltip title={label} autoEllipsis />
                </div>
                {description && (
                    <div className="ms-entity-option__description">
                        <Tooltip title={description} autoEllipsis />
                    </div>
                )}
            </div>
            {selected && <CheckIcon />}
        </div>
    );
});
