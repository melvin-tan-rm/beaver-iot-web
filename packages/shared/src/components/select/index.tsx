import { useMemo } from 'react';
import {
    Select as MuiSelect,
    SelectProps as MuiSelectProps,
    ListSubheader,
    MenuItem,
    FormControl,
    FormHelperText,
    FormControlProps as MuiFormControlProps,
    InputLabel,
} from '@mui/material';
import { type FieldError } from 'react-hook-form';

type Props<T extends ApiKey> = {
    /**
     * If true, the outline is notched to accommodate the label
     */
    notched?: boolean;
    /**
     * Field error
     */
    error?: FieldError;
    /**
     * Drop-down option
     */
    options: OptionsProps<T>[];
    /**
     * Custom drop-down option
     * @returns Return to the customized drop-down option content
     */
    renderOptions?: (options: (OptionsProps<T> & { description?: string })[]) => any[];
    /**
     * Form control props
     */
    formControlProps?: MuiFormControlProps;
};

export type SelectProps<T extends ApiKey> = Props<T> & Omit<MuiSelectProps<T>, 'error'>;

const Select = <T extends ApiKey = ApiKey>(props: SelectProps<T>) => {
    const { options, renderOptions, style, label, error, disabled, formControlProps, ...rest } =
        props;

    // Conversion of down pull option data on of down pull option data
    const getMenuItems = useMemo(() => {
        const list: OptionsProps[] = [];
        const loopItem = (item: OptionsProps): any => {
            if (item.options?.length) {
                list.push({ label: item.label });
                item.options.forEach((subItem: OptionsProps) => {
                    loopItem(subItem);
                });
            } else {
                list.push({ label: item.label, value: item.value });
            }
        };
        options?.forEach((item: OptionsProps) => {
            loopItem(item);
        });
        return list;
    }, [options]);

    return (
        <FormControl sx={{ ...style }} fullWidth {...(formControlProps || {})}>
            {!!label && (
                <InputLabel
                    id="select-label"
                    size={rest?.size as any}
                    required={rest?.required}
                    error={!!error}
                    disabled={disabled}
                >
                    {label}
                </InputLabel>
            )}
            <MuiSelect
                {...rest}
                // @ts-ignore
                notched
                label={label}
                labelId="select-label"
                error={!!error}
                disabled={disabled}
            >
                {renderOptions
                    ? renderOptions(options)
                    : getMenuItems?.map((item: OptionsProps) => {
                          return item?.value ? (
                              <MenuItem value={item.value} key={item.value}>
                                  {item.label}
                              </MenuItem>
                          ) : (
                              <ListSubheader>{item.label}</ListSubheader>
                          );
                      })}
            </MuiSelect>
            {!!error && <FormHelperText error>{error.message}</FormHelperText>}
        </FormControl>
    );
};

export default Select;
