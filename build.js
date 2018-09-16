const os = require('os')
const exec = require('child_process').exec

console.log('---------------------------------------------')
console.log('BABEL BUILDING FOR PLATFORM ' + os.platform())
console.log('---------------------------------------------')

if (os.platform() === 'win32') {
  exec('if exist %cd%\dist rmdir %cd%\dist', function (err, stdout, stderr) {
    if (err)
      throw err
    if (stderr)
      throw stderr
    else {
      console.log(stdout)
      exec('babel lib --out-dir dist --ignore *.tests.js,testHelpers/*', function (err, stdout, stderr) {
        if (err)
          throw err
        if (stderr)
          throw stderr
        else
          console.log(stdout)
      })
    }
  })
} else {
  exec('rm -rf dist/** && babel lib --out-dir dist --ignore *.tests.js,testHelpers/*', function (err, stdout, stderr) {
    if (err)
      throw err
    if (stderr)
      throw stderr
    else
      console.log(stdout)
  })
}