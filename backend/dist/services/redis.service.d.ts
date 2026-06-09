import { ETFApiResponse } from "../types/etf.types";
export declare const redisService: {
    get(): Promise<ETFApiResponse | null>;
    set(data: ETFApiResponse): Promise<void>;
    invalidate(): Promise<void>;
};
//# sourceMappingURL=redis.service.d.ts.map