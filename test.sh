#!/usr/bin/env bash

# start in root
cd "`dirname $0`"

# check a failure run
resD=$(node ./test.js --fatal 2> /dev/null)
exitCode=$?
if [ "$exitCode" == 0 ]; then
  echo "Failure code should be given"
  exit 1
fi

# check successful run
resA=$(node ./test.js 2> /dev/null)
exitCode=$?
if [ "$exitCode" != 0 ]; then
  echo "Failure A"
  exit 1
fi

# check another successful run,
# but run a test using the cwd as 'src'
resB=$(node ./test.js --cwd src 2> /dev/null)
exitCode=$?
if [ "$exitCode" != 0 ]; then
  echo "Failure B"
  exit 1
fi
if [ "$resA" == "$resB" ]; then
  echo "Failure, output should differ with different cwd"
  exit 1
fi

# check shell evaluation
resC=$(node ./test.js --shell src 2> /dev/null)
exitCode=$?
if [ "$exitCode" != 0 ]; then
  echo "Failure C"
  exit 1
fi
if [ "$resA" != "$resC" ]; then
  echo "Failure, output should be same whether using shell or not"
  exit 1
fi

# check a silent run
resC=$(node ./test.js --silent)
if [ -n "$resC" ]; then
  echo "Failure, output should be silent"
  exit 1
fi

echo "Successfully ran all tests"
