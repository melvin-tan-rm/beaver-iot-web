import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

/**
 * Load button assembly
 */
const LoadingButton: React.FC<
    {
        loading?: boolean;
        indicatorColor?: 'primary' | 'secondary' | 'inherit';
    } & ButtonProps
> = ({ children, loading, disabled, indicatorColor = 'inherit', ...otherProps }) => {
    return (
        <Button disabled={disabled || loading === true || false} {...otherProps}>
            <div className="ms-loading-icon">
                {loading && <CircularProgress size={16} color={indicatorColor} sx={{ mr: 1 }} />}
            </div>
            {children}
        </Button>
    );
};

export default LoadingButton;
