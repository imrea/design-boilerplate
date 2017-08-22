# Simple design boilerplate

## What's inside

* *BrowserSync*: For live editing, asset injection and auto refresh
* *Gulp*: Task running and file watching
* *Sass*: With an architecture based on Hugo Giraudel's wonderful [Sass Guidelines](https://sass-guidelin.es/#architecture) and Jonathan Snook's [SMACSS](https://smacss.com)
* *Webpack*: For ES6, etc. goodness

## What this biolerplate isn't

It is merely for development of simple site designs, like the ones on [HTML5UP](https://html5up.net/), this is not meant to be used directly in production - it has no minification, hashing, etc.

## How to use

HTML files are edited directly, BS does the refresh on every save.

JS and SASS files are supposed to be edited in their respective folders in the root, which then get compiled into the `assets` folder. CSS files are injected without refresh, JS updates trigger a full browser refresh.

*I could have set up BS to use a webpack hot middleware, but for such simple applications, without any framework like react/angular etc., that would be overkill, and also could not be too general, should someone use any of the aforementioned.*

Images are directly placed in the `assets/img` folder.

### Running the BS server

For a dynamic development experience

```
yarn run start
```

### Building the assets

```
yarn run build
```
