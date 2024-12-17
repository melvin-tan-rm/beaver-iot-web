import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useForm, Controller, FieldValues, type SubmitHandler } from 'react-hook-form';
import { Grid, Box } from '@mui/material';
import { isEqual } from 'lodash-es';
import useFormItems from './useForm';
import { UseFormItemsProps, FormItemsProps } from './typings';
import './style.less';

interface formProps<T extends FieldValues> {
    formItems: UseFormItemsProps[];
    onOk: (data: T) => void;
    onChange?: (data: T) => void;
    defaultValues?: any;
}

const Forms = <T extends FieldValues>(props: formProps<T>, ref: any) => {
    const { formItems, onOk, onChange, defaultValues } = props;
    const { handleSubmit, control, watch, reset, trigger } = useForm<T>({
        mode: 'onChange',
        defaultValues: {
            ...defaultValues,
        },
    });
    const forms: FormItemsProps[] = useFormItems({ formItems });
    const formValuesRef = useRef<T>();

    // 监听所有表单字段的变化
    const formValues = watch();

    useEffect(() => {
        const values: any = {};
        defaultValues &&
            Object.keys(defaultValues)?.forEach((key: string) => {
                if (defaultValues[key] !== undefined) {
                    values[key] = defaultValues[key];
                }
            });
        !!Object.keys(values)?.length && reset(defaultValues);
    }, [defaultValues, reset]);

    useEffect(() => {
        const values: any = {};
        Object.keys(formValues)?.forEach((key: string) => {
            if (formValues[key] !== undefined) {
                values[key] = formValues[key];
            }
        });
        if (
            (!formValuesRef?.current || !isEqual(formValuesRef?.current, formValues)) &&
            !!Object.keys(values)?.length
        ) {
            formValuesRef.current = { ...formValuesRef?.current, ...formValues };
            // 表单值变更回调
            !!onChange && onChange({ ...formValuesRef?.current, ...formValues });
        }
    }, [formValues]);

    const onSubmit: SubmitHandler<T> = async (data: T) => {
        const result = await trigger(); // 手动触发验证
        if (result) {
            onOk(data);
        } else {
            console.error('Validation failed');
        }
    };

    /** 暴露给父组件的方法 */
    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit(onSubmit),
    }));

    const renderMulForm = (index: number) => {
        const list =
            forms.filter(
                (item, i) =>
                    item.multiple && i >= index && i < index + (item?.multipleIndex || 0) + 1,
            ) || [];
        if (!list?.length) {
            return null;
        }
        return (
            <div style={list[0].style as any} className="form-box">
                {list[0]?.title ? <div className="form-box-label">{list[0]?.title}</div> : null}
                {list.map((item: FormItemsProps) => {
                    return <Controller<T> key={item.name} {...item} control={control} />;
                })}
            </div>
        );
    };

    const renderChildrenForm = (item: FormItemsProps) => {
        return (
            <div style={item.style as any} className="form-box">
                {item?.label ? <div className="form-box-label">{item?.label}</div> : null}
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container>
                        {item?.children?.map((subItem: FormItemsProps) => {
                            if (subItem.customRender) {
                                return subItem.customRender();
                            }
                            // const length = (item?.children?.length || 2) - 1;
                            // const size: number = 6;
                            return (
                                <Grid xs={6}>
                                    <div className="form-box-item">
                                        <Controller<T>
                                            key={subItem.name}
                                            {...subItem}
                                            control={control}
                                        />
                                    </div>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </div>
        );
    };

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <div className="form-contain">
            {forms?.map((item: FormItemsProps, index: number) => {
                if (item.multiple) {
                    return item.multipleIndex === 0 ? renderMulForm(index) : null;
                }
                if (item.children?.length) {
                    return renderChildrenForm(item);
                }
                if (item.customRender) {
                    return item.customRender();
                }
                return <Controller<T> key={item.name} {...item} control={control} />;
            })}
        </div>
    );
};

export const ForwardForms = forwardRef(Forms) as unknown as <T extends FieldValues>(
    props: React.PropsWithChildren<formProps<T>> & {
        ref?: React.ForwardedRef<formProps<T>>;
    },
) => React.ReactElement;

export default ForwardForms;
