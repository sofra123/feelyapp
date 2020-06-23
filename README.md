# Feely


## Summary
Feely is an application for tracking and improving daily mood built with React.js.

## Tech used
* React.js
* Express.js
* Node.js
* PostgreSQL
* Webpack as a module bundler
* Google Natural Language API

## Features
* The web application includes a user registration and a login forms.
* The chatbot analyzes user´s mood with help of Google Natural Language API and produced a sentiment score. 
* The last sentiment calculated during the day is stored in the database and can be visualised in a sentiment score chart.
* If the sentiment score is less than 6.5 the user is invited to fill a gratitude journal otherwise the user is redirected to the sentiment score chart.
