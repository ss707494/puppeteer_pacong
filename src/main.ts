import puppeteer from 'puppeteer'
import {getAllBookImg, getAllChapter, outputChapter} from "./page/book"
import fetch from 'node-fetch'
import {getImgByChapterList, getImgOneChapter, outputUrl} from "./page/page"
import {dealFileDir, delay, downloadLimitAsync, eachLimitAwait, mkdir, retryAwait} from "./common/util"
import nodeAsync from 'async'

const main = async () => {

  const browser = await (puppeteer.launch({
    timeout: 60000,
  }))

  // 查询 整本
  await getAllBookImg(browser, 'https://www.5wmh.com/mh/bw3KNwq.html', d => d.slice(55, 65))

  // 查询单个章节
  // await getImgByChapterList(browser, [
  //     'http://www.5wmh.com/chapter/Ek5PQzA.html',
  //     'http://www.5wmh.com/chapter/rkgJ5pA.html',
  // ])

  // console.log(dealFileDir(new Date().toISOString()))

  // let i = 1
  // const res = await retryAwait(8, async () => {
  //   console.log(i++)
  //   return await fetch('http://sldkee.ffxx.com')
  // }).catch(err => {
  //   console.log(err)
  // })
  // console.log(res)
  // try calling apiMethod 3 times
  // const res = await nodeAsync.retry(5, (callback) => {
  //
  //   setTimeout(() => {
  //     console.log(`do retry ${i++}`)
  //     if (i > 4) {
  //       callback(null, i)
  //     } else {
  //       callback(113)
  //     }
  //   }, 1000)
  // }, function(err, result) {
  //   console.log(`doresult`)
  //   console.log(result)
  //   // do something with the result
  // });
  // const res = await nodeAsync.retry([1, 2, 3, 4, 5, 6, 7, 8, 9], 2, async (url, finish) => {
  //   // new Promise((resolve, reject) => (setTimeout(resolve, 1000))))
  //   await new Promise((resolve, reject) => (setTimeout(reject, 1000)))
  //   console.log(url)
  //   console.log(`do retry ${i++}`)
  // })
  // console.log(res)
  // nodeAsync.eachLimit([1,2,3,4,5,6,7,8,9], 2, async (data, finish) => {
  //   console.log(data)
  //   console.log(finish)
  //   console.log(`do retry ${i++}`)
  //   await (new Promise((resolve, reject) => (setTimeout(resolve, 1000))))
  // }, (err, res) => {
  //   console.log(res)
  //   debugger
  // })
  // let i = 1
  // await eachLimitAwait([1,2,3,4,5,6,7,8,9], 2, async () => {
  //   console.log(i++)
  //   await delay(1000)
  //   console.log(`test end ${i}`)
  // })
  await browser.close()
  console.log('all close')
}

main().then(() => {
  process.exit()
})
