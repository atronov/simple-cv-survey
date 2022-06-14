import {ScorePoints} from './state';

const ARG_NAME = 'points';

export function serializeStateToQuery(state: ScorePoints) {
    const qs = new URLSearchParams();
    qs.append(ARG_NAME, JSON.stringify(state));
    return qs.toString();
}

export function deserializeStateToQuery(query: string): ScorePoints | undefined {
    const qs = new URLSearchParams(query);
    const pointsSting = qs.get(ARG_NAME);
    if (!pointsSting) {
        return undefined;
    }
    return JSON.parse(pointsSting);
}
