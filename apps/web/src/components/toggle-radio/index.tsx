import React from 'react';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';
import { useControllableValue } from 'ahooks';

type ValueType = string | number;

export interface Props {
    value?: ValueType;

    defaultValue?: ValueType;

    options: {
        label: string;
        value: ValueType;
    }[];

    disabled?: boolean;

    onChange?: (value: ValueType) => void;

    sx?: ToggleButtonGroupProps['sx'];
}

/**
 * ToggleRadio Component
 */
const ToggleRadio: React.FC<Props> = ({ options, disabled, sx, ...props }) => {
    const [value, setValue] = useControllableValue<ValueType>(props);

    return (
        <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            className="ms-toggle-button-group ms-workflow-mode-buttons"
            disabled={disabled}
            value={value || props.defaultValue}
            defaultValue={props.defaultValue}
            onChange={(_, val) => {
                if (!val) return;
                setValue(val);
            }}
            sx={{ my: 1.5, lineHeight: 1, ...sx }}
        >
            {options?.map(option => (
                <ToggleButton
                    key={option.value}
                    value={option.value}
                    aria-label={option.label}
                    sx={{ fontWeight: value === option.value ? 500 : 400 }}
                >
                    {option.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
};

export default ToggleRadio;
