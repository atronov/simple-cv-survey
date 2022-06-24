import {FrownOutlined, FireTwoTone, FrownTwoTone} from '@ant-design/icons';
import {List, Rate, Typography, Progress, Space} from 'antd';
import {useCallback} from 'react';
import {RecoilRoot, useRecoilState, useRecoilValue} from 'recoil';

import 'antd/dist/antd.min.css';

import {serializeStateToQuery} from './persistance';
import {calcProgressState, setOnePontScore, progressState, pointsState, maxScore, ScorePoints} from './state';
import {questions} from './data/questions';
import {texts} from './texts';
import styles from './App.module.css';

export const testIds = {
    question: 'question',
    progress: 'progress',
    rateZero: 'rate-zero',
    rateScore: 'rate-score',
} as const;

const App = () => {
    return (
        <RecoilRoot>
            <div className={styles.app}>
                <Header />
                {questions.sections.map((sectionData, i) => (
                    <Section key={sectionData.title} sectionIndex={i} data={sectionData} />
                ))}
            </div>
        </RecoilRoot>
    );
};

/**
 * Appears with results when all questions are answered
 */
const Completion = () => {
    const points = useRecoilValue(pointsState);
    const {totalScore, accepted, passingScore} = useRecoilValue(progressState);
    return (
        <Typography.Text
            strong
            copyable={{
                tooltips: [texts.copyResult, texts.copied],
                text: generateShareText(points),
            }}
        >
            {texts.totalScore} {totalScore}/{maxScore}. {texts.passingScore} {passingScore}.{' '}
            {accepted ? (
                <>
                    {texts.applicantHasPassed}. <FireTwoTone twoToneColor="#ff5f0f" />
                </>
            ) : (
                <>
                    {texts.applicantHasFailed}. <FrownTwoTone />
                </>
            )}
        </Typography.Text>
    );
};

const Header = () => {
    const {answeredCount, totalCount, accepted, completed} = useRecoilValue(progressState);
    const percent = Math.round((answeredCount * 100) / totalCount);
    const progressStatus = completed ? (accepted ? 'success' : 'exception') : 'normal';
    return (
        <div className={styles.header}>
            <div className={styles.headerLine}>
                <Typography.Title>{texts.header}</Typography.Title>
                <div data-testid={testIds.progress}>
                    <Progress type="circle" width={40} percent={percent} status={progressStatus} />
                </div>
            </div>
            {completed ? <Completion /> : null}
        </div>
    );
};

type SectionProps = {
    data: typeof questions.sections[0];
    sectionIndex: number;
};

/**
 * Block of questions grouped by the same topic
 */
const Section = ({data, sectionIndex}: SectionProps) => {
    return (
        <List
            header={<Typography.Title level={3}>{data.title}</Typography.Title>}
            style={{margin: '16px 0 40px'}}
            itemLayout="horizontal"
            dataSource={data.questions}
            renderItem={(item, questionInd) => (
                <div data-testid={testIds.question}>
                    <List.Item>
                        <List.Item.Meta
                            title={item.title}
                            description={item.description
                                ?.split('\n')
                                .map((line) => [line, <br />])
                                .flat()}
                        />
                        <RadioScore maxPointScore={item.maxScore} sectionInd={sectionIndex} questionInd={questionInd} />
                    </List.Item>
                </div>
            )}
        />
    );
};

type PointProps = {
    sectionInd: number;
    questionInd: number;
    maxPointScore: number;
};

/**
 * Represents one question of survey
 */
const RadioScore = (props: PointProps) => {
    const {sectionInd, questionInd, maxPointScore} = props;
    const [points, setPoints] = useRecoilState(pointsState);
    const handlePointChange = useCallback(
        (value: number) => setPoints((oldPoints) => setOnePontScore(oldPoints, sectionInd, questionInd, value)),
        [sectionInd, questionInd, setPoints],
    );
    const handleSetPositiveRate = useCallback(
        (rateValue: number) => {
            handlePointChange(rateValue === 0 ? -1 : rateValue);
        },
        [handlePointChange],
    );
    const handleSetNegativeRate = useCallback(
        (rateValue: number) => {
            handlePointChange(rateValue === 0 ? -1 : 0);
        },
        [handlePointChange],
    );
    const point = points[sectionInd][questionInd];
    return (
        <Space>
            <div data-testid={testIds.rateZero}>
                <Rate
                    value={point === 0 ? 1 : 0}
                    count={1}
                    character={() => <FrownOutlined />}
                    onChange={handleSetNegativeRate}
                />
            </div>
            <div data-testid={testIds.rateScore}>
                <Rate value={Math.max(point, 0)} count={maxPointScore} onChange={handleSetPositiveRate} />
            </div>
        </Space>
    );
};

function generateShareText(pointsState: ScorePoints) {
    if (typeof window === 'undefined') {
        return '';
    }
    const url = new URL(window.location.href);
    url.search = serializeStateToQuery(pointsState);
    const {totalScore, passingScore, accepted} = calcProgressState(pointsState);
    let result = `${url.toString()}
${texts.totalScore} ${totalScore}/${maxScore}. ${texts.passingScore} ${passingScore}. ${
        accepted ? texts.hasPassed : texts.hasFailed
    }.

${texts.details}:`;
    const flatQuestions = questions.sections.flatMap((section) => section.questions.map((question) => question.title));
    const flatPoints = pointsState.flat(1);
    for (let i = 0; i < flatQuestions.length; i++) {
        result += `\n${flatQuestions[i]} - ${flatPoints[i]}`;
    }
    return result;
}

export default App;
