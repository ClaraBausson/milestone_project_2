# Budget vizualisation website
🔸 Milestone Project #2: Interactive Frontend Development - Code Institute

🔸 _Author_ : Clara Bausson  

## Overview
This project has been conceived in the idea of a company offering to a client the possibility of creating a personalised budget dashboard. In the long-term, this website will be updated with a data integration to adapt to various bank data formats, and a much more detailed dashboard.

> The budget is not just a collection of numbers, but an expression of our values and aspirations.
> — Jack Lew

The primary goal is to easily visualize the various categories, incomes and expenses from the data, and directly interact with the dashboard, as well as informind the user on why budgeting is important, and how to budget correctly.

To give users a better front-end experience, I've decided to only create one page containing fewer charts and explanatory text, in the mindset of an interactive article. With a very minimalistic and bright UI, it is aiming to make the idea of a budget more "fun".

## Deployment
The live project url is https://clarabausson.github.io/milestone_project_2/. 
This site is hosted using GitHub pages, deployed directly from the master branch. The deployed site will update automatically upon new commits to the master branch. In order for the site to deploy correctly on GitHub pages, the landing page must be named index.html.

To run locally, you can clone this repository directly into the editor of your choice by pasting the following command into your terminal:

`git clone https://github.com/ClaraBausson/milestone_project_2.git`

### Git Approach
Just say whatever you did like how often did you commit? How did you write commit messages etc?

When did you deploy first version to the github pages?

###### Commit frequency
I've tried to commit after each major content update, or every 10 minor updates.

###### Commit messages
I've tried to be as descriptive as possible in my commit messages, to be able to review quickly when I added a major feature.

###### First deployment
I've deployed the website on the 10/11/2019, once the basic layout and initial chart work was created.

## UX
The main goal for this project was to make it as easy as possible for users to visualize and understand the data. The color scheme is pastel with a focus on light blue-green and pink, to keep the website minimalistic and simple.

The website currently contains various charts, all interactive and interacting with each other; selecting one category or month on one chart will update the other charts.

##### List of charts:

- Bar chart - shows how many transactions of each type have been made
  ![BarChart](https://res.cloudinary.com/dqxvu3dz5/image/upload/v1574015466/MP2_README.md/Chart1_Barchart_transactions_zkb0z8.png)

- Select Menu - allows the user to select and filter the data to a specific month

  ![SelectMenu](https://res.cloudinary.com/dqxvu3dz5/image/upload/v1574015466/MP2_README.md/SelectMenu_lds1z9.png)

- Pie Chart (income) - shows the total of all your incomes (separated per category)
  ![PieChartIncome](https://res.cloudinary.com/dqxvu3dz5/image/upload/v1574015466/MP2_README.md/Chart2_Piechart_income_jocznr.png)

- Pie Chart (expenses) - shows the total of all your expenses (separated per category)
  ![PieChartExpenses](https://res.cloudinary.com/dqxvu3dz5/image/upload/v1574015529/MP2_README.md/Chart3_Piechart_expenses_mx5cxo.png)

- Stacked Bar Chart - shows the various expenses' categories across the year
  ![StackedBarChart](https://res.cloudinary.com/dqxvu3dz5/image/upload/v1574015466/MP2_README.md/Chart4_Stackchart_expenses_tceuo3.png)

- Line Chart - shows the balance's evolution throughout the year
  ![LineChart](https://res.cloudinary.com/dqxvu3dz5/image/upload/v1574015701/MP2_README.md/Chart5_Linechart_balance_tx3t9e.png)



## Technologies
1. [HTML5](https://en.wikipedia.org/wiki/HTML5)
2. [CSS3](https://en.wikipedia.org/wiki/Cascading_Style_Sheets)
3. [Bootstrap (4.3.1)](https://getbootstrap.com/)
4. [Javascript](https://en.wikipedia.org/wiki/JavaScript)
5. [JQuery](https://jquery.com/)
6. [DC.js](https://dc-js.github.io/dc.js/)
7. [D3.js](https://d3js.org/)
8. [Crossfilter](https://square.github.io/crossfilter/)

## Features

### Existing Features
* Responsiveness on both mobile and desktop
* Connected charts - all charts are linked and interact with each others
* Interactive charts - all charts can be manipulated by the user, and the user can obtain more info by hovering any part of the data

### Features Left to Implement
* Email request feature


## Testing

### Remaining bugs
* Months are not in correct order
* Credit transations are displayed in debit-based charts and vice versa (need to filter out data)
* Hover data is not formatted

## Credits

### Authors

* **Clara Bausson** - *Initial work* - [ClaraBausson](https://github.com/ClaraBausson)

### Content
Text content was based on various websites:
* [moneyaware.com](https://moneyaware.co.uk/2018/06/how-to-budget-your-money/)
* [kclau.com](https://kclau.com/wealth-management/3-types-of-income-active-portfolio-and-passive-income/)
* [localfirstbank.com](https://localfirstbank.com/content/personal-budget-categories/)
* [mymoneycoach.ca](https://www.mymoneycoach.ca/budgeting/what-is-a-budget-planning-forecasting)


### Media
All background images were taken from two stock image libraries, [Pexels](https://www.pexels.com/) and [Pixabay](https://pixabay.com/). Some pictures were modified with filters, to better fit the overall theme.

### Acknowledgements

**This is for educational use.** 