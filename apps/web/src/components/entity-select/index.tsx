import React from 'react';
import { useControllableValue } from 'ahooks';
import EntitySelect from './entitySelect';
import { useContextValue, useSourceData } from './hooks';
import { EntityContext } from './context';
import type { EntitySelectContext, EntitySelectProps, EntitySelectValueType } from './types';

const EntitySelectApp = <
    Value extends EntitySelectValueType = EntitySelectValueType,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    Props extends EntitySelectProps<Value, Multiple, DisableClearable> = EntitySelectProps<
        Value,
        Multiple,
        DisableClearable
    >,
>(
    props: EntitySelectProps<Value, Multiple, DisableClearable>,
) => {
    const {
        multiple,
        maxCount: _maxCount,
        loading,
        entityType,
        entityValueType,
        entityAccessMod,
        excludeChildren,
        popperWidth,
        filterOption,
    } = props;
    const maxCount = multiple ? _maxCount : void 0;

    const {
        entityList,
        onSearch,
        loading: sourceLoading,
    } = useSourceData({
        entityType,
        entityValueType,
        entityAccessMod,
        excludeChildren,
    });
    const [value, onChange] = useControllableValue<Required<Props>['value']>(props);
    const { contextValue } = useContextValue<Value, Multiple, DisableClearable>({
        value,
        maxCount,
        multiple,
        onChange,
        entityList,
        filterOption,
        popperWidth,
    });

    return (
        <EntityContext.Provider value={contextValue as unknown as EntitySelectContext}>
            <EntitySelect<Value, Multiple, DisableClearable>
                {...props}
                multiple={multiple}
                value={value}
                onChange={onChange}
                loading={loading || sourceLoading}
                onSearch={onSearch}
            />
        </EntityContext.Provider>
    );
};
export default React.memo(EntitySelectApp) as unknown as typeof EntitySelectApp;

export type { EntitySelectOption, EntitySelectValueType, EntitySelectProps } from './types';
