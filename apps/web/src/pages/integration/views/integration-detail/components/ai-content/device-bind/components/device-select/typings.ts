import { type AiAPISchema } from '@/services/http';

export type ValueType = Partial<AiAPISchema['getDevices']['response']['content'][0]> & {
    id: ApiKey;
};
