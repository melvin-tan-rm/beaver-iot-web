import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
} from '@mui/material';

const permissions = [
    {
        model: 'Dashboard',
        pages: [{ name: 'Dashboard', functions: ['view', 'add', 'edit', 'delete'] }],
    },
    {
        model: 'Device',
        pages: [{ name: 'Device', functions: ['view', 'add', 'edit', 'delete'] }],
    },
    {
        model: 'Integration',
        pages: [{ name: 'Integration', functions: ['view', 'add', 'edit', 'delete'] }],
    },
    {
        model: 'Entity',
        pages: [
            { name: 'Custom Entity', functions: ['view', 'add', 'edit', 'delete'] },
            { name: 'Entity Data', functions: ['view', 'add', 'edit', 'delete'] },
        ],
    },
];

/**
 * functions table component
 */
const FunctionsTable = () => {
    const [checked, setChecked] = React.useState<any>({});

    const handleChange = (page: any, func: any) => {
        setChecked((prev: any) => ({
            ...prev,
            [page]: {
                ...prev[page],
                [func]: !prev[page]?.[func],
            },
        }));
    };

    return (
        <TableContainer>
            <Table sx={{ border: '1px solid var(--border-color-base)' }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Model</TableCell>
                        <TableCell sx={{ borderLeft: '1px solid var(--border-color-base)' }}>
                            Page
                        </TableCell>
                        <TableCell sx={{ borderLeft: '1px solid var(--border-color-base)' }}>
                            Function
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {permissions.map(permission => (
                        <React.Fragment key={permission.model}>
                            <TableRow>
                                <TableCell rowSpan={permission.pages.length + 1}>
                                    {permission.model}
                                </TableCell>
                            </TableRow>
                            {permission.pages.map(page => (
                                <TableRow key={page.name}>
                                    <TableCell
                                        sx={{ borderLeft: '1px solid var(--border-color-base)' }}
                                    >
                                        {page.name}
                                    </TableCell>
                                    <TableCell
                                        sx={{ borderLeft: '1px solid var(--border-color-base)' }}
                                    >
                                        {page.functions.map(func => (
                                            <Checkbox
                                                key={func}
                                                checked={checked[page.name]?.[func] || false}
                                                onChange={() => handleChange(page.name, func)}
                                                color="primary"
                                            />
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FunctionsTable;
