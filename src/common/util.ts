import fs from 'fs'
import fetch from 'node-fetch'
import eachLimit from 'async/eachLimit'
import retry from 'async/retry'

export const downloadImage = async (url, dir) => {
  const fileName = url.slice(url.lastIndexOf('/') + 1)
  console.log(`downloadImage:start:: ${fileName}`)
  try {
    const res = await fetch(url)
    const stream = fs.createWriteStream(`${dir}/${fileName}`);
    res.body.pipe(stream)
    console.log(`downloadImage:end:: ${fileName}`)
  } catch (e) {
    console.error('downloadImage: sserror')
    console.log(e)
    throw e
  }
}

export const downloadLimitAsync = async (urls, dir, limit = 3) => {
  console.log(`start: downloadLimitAsync`)
  await eachLimitAwait(urls, limit, async (url) => {
    await retryAwait(5, () => downloadImage(url, `${dir}`))
  })
  console.log(`end: downloadLimitAsync`)
}

export const mkdir = (dir, path: string[]) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  path.reduce((i, e) => {
    if (!fs.existsSync(`${i}/${e}`)) {
      fs.mkdirSync(`${i}/${e}`)
    }
    return `${i}/${e}`
  }, dir)
  return `${dir}/${path.join('/')}`
}

export const delay = (time) => (new Promise(resolve => setTimeout(resolve, time)))

export const eachLimitAwait = (list, limit, asyncFun) => new Promise((resolve, reject) => {
  eachLimit(list, limit, (item, finish) => {
    asyncFun(item)
        .then(() => finish())
        .catch(e => {
          console.log(e)
          finish()
        })
  }, (err) => {
    if (err) {
      reject(err)
    } else {
      resolve()
    }
  })
})

export const retryAwait = (times, asyncFun) => new Promise((resolve, reject) => {
  retry({
    times,
    interval: 500,
  }, (callback) => {
    asyncFun().then(res => {
      callback(null, res)
    }).catch(err => {
      console.log(`callretry:: `)
      console.log(err)
      callback(err)
    })
  }, (err, result) => {
    if (err) {
      reject(err)
    } else {
      resolve(result)
    }
  })
})

export const dealFileDir = (dir: string) => dir.replace(/[,\\:.\-*<>|"?\r\n]/g, '').trim()
