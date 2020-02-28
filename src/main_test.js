const nodeAsync = require('async')

// test rebase
// rebase2

// develop

const main = () => {

  let i = 1
  nodeAsync.eachLimit([1, 2, 3, 4, 5, 6, 7, 8, 9], 2, async (url) => {
    // new Promise((resolve, reject) => (setTimeout(resolve, 1000))))
    await new Promise((resolve, reject) => (setTimeout(resolve, 1000)))
    console.log(`do retry ${i++}`)
    console.log(url)
    // setTimeout(() => {
    //   console.log(url)
    //   finish()
    // }, 1000)
  }, (err) => {
    if( err ) {
      // One of the iterations produced an error.
      // All processing will now stop.
      console.log('A file failed to process');
    } else {
      console.log('All files have been processed successfully');
    }
    // if (err) throw err
    // results is now an array of the response bodies
  })
}

main()
