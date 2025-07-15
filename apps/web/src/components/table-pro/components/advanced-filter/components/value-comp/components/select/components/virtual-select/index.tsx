import React, { useRef } from 'react';
import { useVirtualList } from '@milesight/shared/src/hooks';
import { VirtualSelectProps } from '../../../../types';
import { SelectValueOptionType } from '../../../../../../../../types';
import RowOption from '../row-option';

interface IProps<T extends SelectValueOptionType>
    extends Pick<VirtualSelectProps<T>, 'options' | 'selectedMap' | 'onItemChange'> {
    renderOption?: ({
        option,
        selected,
        onChange,
    }: {
        option: T;
        selected: boolean;
        onChange: (event: React.SyntheticEvent, value: SelectValueOptionType) => void;
    }) => React.ReactNode;
}

const MAX_HEIGHT = 400;

export default React.memo((props: IProps<SelectValueOptionType>) => {
    const { options, selectedMap, onItemChange, renderOption, ...rest } = props;

    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    /** virtual list */
    const [virtualList] = useVirtualList(options, {
        containerTarget: containerRef,
        wrapperTarget: listRef,
        itemHeight: 30,
        overscan: 10,
    });
    console.log(options.length);
    return (
        <div {...rest} ref={containerRef}>
            <div ref={listRef} style={{ height: MAX_HEIGHT }}>
                {(virtualList || []).map(({ data: option }) => {
                    // Only entity drop-down
                    const selected = selectedMap.has(option.value);
                    return renderOption ? (
                        renderOption({
                            option,
                            selected,
                            onChange: onItemChange,
                        })
                    ) : (
                        <RowOption
                            key={option.value}
                            option={option}
                            selected={selected}
                            onChange={onItemChange}
                        />
                    );
                })}
            </div>
        </div>
    );
});
