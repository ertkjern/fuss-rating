# Evry Fuss Rating System

A super simple fuss rating system based on the Chess [ELO-rating](https://no.wikipedia.org/wiki/Elo-rating).

The app can be found and used at [https://ertkjern.com/fuss](https://ertkjern.com/fuss).

After you have played a new match, you can register a winner and a looser. Then the system will calculate 
a rating based on the rating between the two players. 

The following web project is an *Angular 7.x* project. The styling is built on [Bootstrap 4.x Beta](https://getbootstrap.com/) as CSS framework. Styling is otherwise implemented using [SCSS](http://sass-lang.com/guide). 


## Content

* [Installation](#installation)
* [Contribution](#contribution)
* [Gentleman Agreement](#Gentleman Agreement)
* [Code scaffolding](#Code scaffolding)
* [Further help] (#Further help)

## Installation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.0-beta.

Clone the project:

`git clone https://github.com/ertkjern/fuss-rating.git`

Install all packages using either npm or yarn:

`npm install` or `yarn install`

To be able to use add matches you have to create a new Firebase datbase. This is a free service to use. 
The production database is public, but please don't use this for testing. I recommend therefore to create a new 
*Firestore database* and enable *email authentication*. 

After you have created a new Firebase database, you can add the firebase information to the `environment.ts` files 
A more detailed description on how to setup Firebase with Angular can be found [here](https://github.com/angular/angularfire2) and a 
more detailed description of Firebase itself can be foun [here](https://firebase.google.com/).

After you have setup Firebase, you can run the project like this:

`npm start` 

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Gentleman Agreement

You can easily create matches and register fake ratings. 
This is a gentleman system. Use it with care and don't ruin the fun.  

## Contribution

Contribution is done using Pull Requests and creating Issues. 
You know the deal. 

Before creating a Pull Request you should run the following commands:

```
npm run build // to verify that everything is running
```

```
npm run test // to verify nothing has been broken
```

```
npm run lint // to avoid bad code, as missing semicolons.
 

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
