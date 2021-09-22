const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const shell = require('shelljs')
const { live } = require('./dist/index')
const { live: promiseLive } = require('./dist/promise')

const argv = yargs(hideBin(process.argv)).argv
shell.config.silent = Boolean(argv.silent)
shell.config.fatal = Boolean(argv.fatal)

// TODO: test silent/fatal passed-in as options

let successStatusA = live(argv.shell ? 'ls -al && cd .' : ['ls', '-al'])
if (successStatusA !== 0) {
  console.error('should succeed')
  process.exit(successStatusA)
}

let successStatusB = live(argv.shell ? 'ls -al && cd .' : ['ls', '-al'], {
  cwd: argv.cwd || '.'
})
if (successStatusB !== 0) {
  console.error('should succeed in different CWD')
  process.exit(successStatusB)
}

let failureStatusA = live(['asdfasdfasdf'])
if (failureStatusA === 0) {
  console.error('status should be non-zero when command does not exist')
  process.exit(1)
}

let failureStatusB = live(['ls', 'asdfasdfasdf'])
if (failureStatusB === 0) {
  console.error('status should be non-zero when command fails')
  process.exit(1)
}

function testSuccessAsync() {
  let start = Date.now()
  return new Promise((resolve, reject) => {
    live(['sleep', '1'], (status) => {
      let end = Date.now()
      let dur = end - start
      if (status !== 0) {
        reject(new Error('async did not succeed'))
      } else if (dur < 1000) {
        reject(new Error('async is not async'))
      } else {
        resolve()
      }
    })
  })
}

function testSuccessPromise() {
  let start = Date.now()
  return promiseLive(['sleep', '1']).then(() => {
    let end = Date.now()
    let dur = end - start
    if (dur < 1000) {
      throw new new Error('promise is not async')
    }
  }, () => {
    throw new Error('promise did not fail')
  })
}

function testFailurePromise() {
  return promiseLive(['ls', 'asdfasdfasdf']).then(() => {
    throw new Error('async should fail')
  }, () => {
    // handle error by doing nothing
  })
}

Promise.all([
  testSuccessAsync(),
  testSuccessPromise(),
  testFailurePromise(),
]).then(() => {
  if (!argv.silent) {
    console.log('Successfully ran all tests')
  }
}, (err) => {
  console.error(err.toString())
  process.exit(1)
})
