import { createContext } from 'react';
import type { EntitySelectContext } from './types';

export const EntityContext = createContext<EntitySelectContext>({} as EntitySelectContext);
