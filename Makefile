# mocha binary location
MOCHA = ./node_modules/mocha/bin/mocha

# tests to run in mocha
TESTS = test

# console logging for a section of the code (csv's), available options are in README.md
# DEBUG = 'QueryIncludesDecorator QueryIncludeBag objects:middleware:index saml middleware:urlParamsProcessor'
DEBUG = ''

# these do not cache (this isn't c objects caching after all)
.PHONY: test install cleanup_after_test lint run_tests

#all other options come from test/mocha.opts
run_tests:
		-@NODE_ENV=test DEBUG=$(DEBUG) $(MOCHA) test/smoke_test $(TESTS) | node_modules/.bin/bunyan

###########################################
# Below are intented to be run
###########################################

# setup development directories, permissions, and modules. One stop shop
install:
	npm update

test: lint run_tests cleanup_after_test

cleanup_after_test:
	@echo Makefile says I clean up after myself

# lint the entire set of files
lint:
	@echo "Linting libs and tests, stand by..."
	@echo "ESLint..."
	@./node_modules/eslint/bin/eslint.js --quiet test

