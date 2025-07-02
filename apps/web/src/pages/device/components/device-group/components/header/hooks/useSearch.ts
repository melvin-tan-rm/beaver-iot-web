import React, { useState, useRef } from 'react';
import { useClickAway, useMemoizedFn } from 'ahooks';

export function useSearch(onSearch?: (keyword: string) => void) {
    const [showSearch, setShowSearch] = useState(false);
    const [keyword, setKeyword] = useState('');

    const inputRef = useRef<HTMLInputElement>();
    const textFieldRef = useRef(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    /**
     * if click outside of the textfield
     * hidden the search input and blur it
     */
    useClickAway(() => {
        if (keyword) return;

        setShowSearch(false);
        inputRef?.current?.blur();
    }, textFieldRef);

    const handleChange = useMemoizedFn(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const newValue = e?.target?.value || '';
            setKeyword(newValue);
            onSearch?.(newValue);
        },
    );

    const handleMouseEnter = useMemoizedFn(() => {
        timeoutRef.current = setTimeout(() => {
            if (showSearch) return;

            setShowSearch(true);
            inputRef?.current?.focus();
        }, 200);
    });

    const handleMouseLeave = useMemoizedFn(() => {
        if (!timeoutRef?.current) return;

        clearTimeout(timeoutRef.current);
    });

    return {
        /** Whether show the search input */
        showSearch,
        /** the search keyword */
        keyword,
        textFieldRef,
        inputRef,
        handleChange,
        handleMouseEnter,
        handleMouseLeave,
    };
}
