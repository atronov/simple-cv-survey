# Simple web-app to handle applicant's CV

## What's under the hood

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
So all available Scripts from CRA work here.

## Motivation

This app was quickly built to improve process of handling applicants' CVs. It helps to make decision of next steps with an applicant.

It also can be used not only to deal with CVs. It can help when you deal with routine of making a positive or negative decision accordion to check-list.

Additionally, I tried [Recoil](https://recoiljs.org) during development. I also used [Ant Design](https://ant.design) components because I like them.

## User guide

###  Usage

- Open the survey page.
- Set appropriate score for each question clicking at count of stars or sad face.
- When completed, you see the decision (passed/failed) at the top of the page.
- You can share result and details by click at copy icon. Now result text and share link are into your clipboard.
- Obviously share link works only you hosted the page somewhere.
- Or better try it yourself https://simple-cv-survey.website.yandexcloud.net

![image](https://user-images.githubusercontent.com/5829206/173688688-62287653-6e9e-46f9-9b0d-f2e654d26065.png)

### Tuning

- To change the questions go to src/data/questions.ts. Edit questions keeping the schema.
- To change the passing score go to src/data/passingScore.ts.
- For the sake of simplicity the app doesn't have any i18n lib or other lang detect. 
To change texts or translations go src/texts/index.ts. There import right file with text, create new one or change existing.
