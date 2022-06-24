export type SurveyData = {
    sections: {
        title: string;
        questions: {
            title: string;
            description?: string;
            maxScore: number;
        }[];
    }[];
};

export const questions: SurveyData = {
    sections: [
        {
            title: 'Experience',
            questions: [
                {
                    title: 'Challenges and achievements',
                    description: `more achievements - more score
    - rely difficult tasks;
    - skip trivial and routine tasks;
    - tasks that brought high product value`,
                    maxScore: 3,
                },
                {
                    title: 'Working at top IT-companies',
                    maxScore: 1,
                },
                {
                    title: 'years or experience at software engineering',
                    description: `3+ - 1 star;
                5+ - 2 stars;
                7+ - 3 stars`,
                    maxScore: 3,
                },
                {
                    title: 'Full-stack or backend experience',
                    maxScore: 1,
                },
                {
                    title: 'CI/CD/Automation/Infra',
                    maxScore: 1,
                },
                {
                    title: 'High skill of css and html',
                    maxScore: 1,
                },
            ],
        },
        {
            title: 'Education',
            questions: [
                {
                    title: "At least bachelor's degree",
                    maxScore: 1,
                },
                {
                    title: "Master's degree",
                    maxScore: 1,
                },
                {
                    title: 'computer science or software engineering or math',
                    maxScore: 1,
                },
            ],
        },
        {
            title: 'Self-development',
            questions: [
                {
                    title: 'Pet-projects',
                    description: 'at least short description of projects',
                    maxScore: 1,
                },
                {
                    title: 'Working links to personal web-sites or projects',
                    maxScore: 1,
                },
                {
                    title: 'Open-source contributor',
                    maxScore: 1,
                },
                {
                    title: 'Active profile at coding resources',
                    description: 'GitHub, LeetCode, HackerRank and other coding sites links',
                    maxScore: 1,
                },
            ],
        },
    ],
};
