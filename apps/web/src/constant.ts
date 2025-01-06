// Entity Pattern
export enum ENTITY_AEECSS_MODE {
    R = 'R',
    RW = 'RW',
    W = 'W',
}

// Entity Type
export enum ENTITY_TYPE {
    SERVICE = 'SERVICE',
    PROPERTY = 'PROPERTY',
    EVENT = 'EVENT',
}

// Entity Value Type
export enum ENTITY_VALUE_TYPE {
    STRING = 'STRING',
    long = 'LONG',
    BOOLEAN = 'BOOLEAN',
    BINARY = 'BINARY',
    OBJECT = 'OBJECT',
    ENUM = 'ENUM',
}

export const entityTypeOptions = [
    {
        label: 'entity.label.entity_type_of_int',
        value: 'LONG',
    },
    {
        label: 'entity.label.entity_type_of_float',
        value: 'DOUBLE',
    },
    {
        label: 'entity.label.entity_type_of_boolean',
        value: 'BOOLEAN',
    },
    {
        label: 'entity.label.entity_type_of_string',
        value: 'STRING',
    },
];
