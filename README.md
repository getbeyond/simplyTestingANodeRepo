If you have [nodejs](https://nodejs.org/) installed, you can just do these two commands and see results:

     make install
     make test

You can limit the scope of files tested by inidicating directory or file to be tested

    make test TESTS=test/useTheWeb.js
    
Config file `test/mocha.opts` contains settings like list of global variables or default timeout for single test. Full list of options is available at [https://mochajs.org/](https://mochajs.org/#usage)

If you don't want to use Makefile, you can use npm scripts that are less flexible:

    npm install
    npm test
    npm run lint
