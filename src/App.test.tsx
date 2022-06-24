import {render, screen, fireEvent, getByRole, getByTestId, getAllByRole} from '@testing-library/react';
import App, {testIds} from './App';
import {passingScore} from './data/passingScore';
import {texts} from './texts';

const progressPercentRegex = /\b\d{1,2}%/;

describe('App', () => {
    test('inited with 0% state', () => {
        render(<App />);
        expect(screen.getByTestId(testIds.progress)).toHaveTextContent('0%');
    });

    test('inited with all points not ticked', () => {
        render(<App />);
        const allCheckboxes = screen.queryAllByRole('radio');
        allCheckboxes.forEach((checkBox) => expect(checkBox).not.toBeChecked());
    });

    test('progress increased after some points checked', () => {
        render(<App />);
        const allQuestions = screen.queryAllByTestId(testIds.question);
        // tick more then one percent
        let ticked = 0;
        for (let question of allQuestions) {
            // eslint-disable-next-line testing-library/prefer-screen-queries
            const questionRadios = getAllByRole(question, 'radio');
            const randInd = ~~(questionRadios.length * Math.random());
            fireEvent.click(questionRadios[randInd]);
            ticked++;
            // tick at lease 1% of points
            if (ticked / allQuestions.length > 0.01) {
                break;
            }
        }
        const progress = screen.getByTestId(testIds.progress);
        expect(progress).not.toHaveTextContent('0%');
        expect(progress).toHaveTextContent(progressPercentRegex);
    });

    test('passed if all points are checked with maximum score', () => {
        render(<App />);
        for (let rate of screen.queryAllByTestId(testIds.rateScore)) {
            // eslint-disable-next-line testing-library/prefer-screen-queries
            const radios = getAllByRole(rate, 'radio');
            if (radios.length) {
                // click the last
                fireEvent.click(radios[radios.length - 1]);
            }
        }
        expect(screen.getByText(texts.applicantHasPassed, {exact: false})).toBeInTheDocument();
        const progress = screen.getByTestId(testIds.progress);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const progressImg = getByRole(progress, 'img');
        expect(progressImg).toHaveAttribute('aria-label', 'check');
    });

    test('failed if all points are checked with empty score', () => {
        render(<App />);
        for (let rate of screen.queryAllByTestId(testIds.rateZero)) {
            // eslint-disable-next-line testing-library/prefer-screen-queries
            const radio = getByRole(rate, 'radio');
            fireEvent.click(radio);
        }
        expect(screen.getByText(texts.applicantHasFailed, {exact: false})).toBeInTheDocument();
        const progress = screen.getByTestId(testIds.progress);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const progressImg = getByRole(progress, 'img');
        expect(progressImg).toHaveAttribute('aria-label', 'close');
    });

    test('not completed if at lease one point not checked', () => {
        render(<App />);
        const rates = screen.queryAllByTestId(testIds.rateScore);
        // click all rates except last
        for (let i = 0; i < rates.length - 2; i++) {
            // eslint-disable-next-line testing-library/prefer-screen-queries
            fireEvent.click(getAllByRole(rates[i], 'radio')[0]);
        }
        expect(screen.queryByText(texts.applicantHasPassed, {exact: false})).not.toBeInTheDocument();
        expect(screen.queryByText(texts.applicantHasFailed, {exact: false})).not.toBeInTheDocument();
        const progress = screen.getByTestId(testIds.progress);
        expect(progress).toHaveTextContent(progressPercentRegex);
    });

    test('passed if total score == passing score', () => {
        render(<App />);
        let currentScore = 0;
        for (let question of screen.queryAllByTestId(testIds.question)) {
            if (currentScore < passingScore) {
                // eslint-disable-next-line testing-library/prefer-screen-queries
                const rateScore = getByTestId(question, testIds.rateScore);
                // eslint-disable-next-line testing-library/prefer-screen-queries
                const radios = getAllByRole(rateScore, 'radio');
                for (let radio of radios) {
                    fireEvent.click(radio);
                    currentScore++;
                    if (currentScore >= passingScore) {
                        break;
                    }
                }
            } else {
                // eslint-disable-next-line testing-library/prefer-screen-queries
                const rateScore = getByTestId(question, testIds.rateZero);
                // eslint-disable-next-line testing-library/prefer-screen-queries
                const radio = getByRole(rateScore, 'radio');
                fireEvent.click(radio);
            }
        }
        expect(screen.getByText(texts.applicantHasPassed, {exact: false})).toBeInTheDocument();
        expect(screen.queryByText(texts.applicantHasFailed, {exact: false})).not.toBeInTheDocument();
        const progress = screen.getByTestId(testIds.progress);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const progressImg = getByRole(progress, 'img');
        expect(progressImg).toHaveAttribute('aria-label', 'check');
        expect(progressImg).not.toHaveAttribute('aria-label', 'close');
    });

    test('failed if total score < passing score', () => {
        render(<App />);
        let currentScore = 0;
        for (let question of screen.queryAllByTestId(testIds.question)) {
            if (currentScore < passingScore - 1) {
                // eslint-disable-next-line testing-library/prefer-screen-queries
                const rateScore = getByTestId(question, testIds.rateScore);
                // eslint-disable-next-line testing-library/prefer-screen-queries
                const radios = getAllByRole(rateScore, 'radio');
                for (let radio of radios) {
                    fireEvent.click(radio);
                    currentScore++;
                    if (currentScore >= passingScore - 1) {
                        break;
                    }
                }
            } else {
                // eslint-disable-next-line testing-library/prefer-screen-queries
                const rateScore = getByTestId(question, testIds.rateZero);
                // eslint-disable-next-line testing-library/prefer-screen-queries
                const radio = getByRole(rateScore, 'radio');
                fireEvent.click(radio);
            }
        }
        expect(screen.queryByText(texts.applicantHasPassed, {exact: false})).not.toBeInTheDocument();
        expect(screen.getByText(texts.applicantHasFailed, {exact: false})).toBeInTheDocument();
        const progress = screen.getByTestId(testIds.progress);
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const progressImg = getByRole(progress, 'img');
        expect(progressImg).not.toHaveAttribute('aria-label', 'check');
        expect(progressImg).toHaveAttribute('aria-label', 'close');
    });
});
