import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { type EntityAPISchema } from '@/services/http';

type EntityData = EntityAPISchema['getList']['response']['content'][number];
interface EntityStore {
    entityList: EntityData[];
    setEntityList: (entityList: EntityData[]) => void;
}

export default create(
    immer<EntityStore>(set => ({
        entityList: [],
        setEntityList: entityList => set({ entityList }),
    })),
);
