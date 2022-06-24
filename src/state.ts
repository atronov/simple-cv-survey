import {atom, selector} from 'recoil';
import {passingScore} from './data/passingScore';
import {questions} from './data/questions';
import {deserializeStateToQuery} from './persistance';

const initPointsState = () => {
    const {search} = window.location;
    // try to restore it from url-params
    let initialState = deserializeStateToQuery(search);
    // otherwise create empty
    if (!initialState) {
        initialState = questions.sections.map((section) => section.questions.map(() => -1));
    }
    return initialState;
};

export const maxScore = questions.sections
    .flatMap((section) => section.questions.map((question) => question.maxScore))
    .reduce((a, b) => a + b, 0);

export type ScorePoints = number[][];

export const pointsState = atom<ScorePoints>({
    key: 'points',
    default: initPointsState(),
});

export const progressState = selector({
    key: 'surveyProgress',
    get: ({get}) => {
        const state = get(pointsState);
        return calcProgressState(state);
    },
});

export function setOnePontScore(oldState: ScorePoints, sectionInd: number, pointInd: number, score: number) {
    return oldState.map((line, lineI) => {
        if (lineI !== sectionInd) {
            return line;
        }
        return line.map((curVal, curJ) => (curJ !== pointInd ? curVal : score));
    });
}

export function calcProgressState(state: ScorePoints) {
    const flatState = state.flat(1);
    const answeredPoints = flatState.filter((point) => point !== -1);
    const totalScore = answeredPoints.reduce((a, b) => a + b, 0);
    const answeredCount = answeredPoints.length;
    const totalCount = flatState.length;
    const accepted = totalScore >= passingScore;
    const completed = answeredCount === totalCount;
    return {
        answeredCount,
        totalCount,
        totalScore,
        accepted,
        completed,
        passingScore,
    };
}
