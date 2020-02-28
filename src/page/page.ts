import fs from 'fs'
import {dealFileDir, downloadLimitAsync, eachLimitAwait, mkdir} from "../common/util"

export const getImgOneChapter = async (browser, chapterUrl) => {
  try {
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.goto(chapterUrl)
    const res = await page.evaluate(() => {
      const list = Array.from(document.querySelectorAll('.comicpage .comicimg')).map(v => v?.['src'])
      const title = document.querySelector('.title')['innerText']
      const name = document.querySelector('.comic-name')['innerText']
      return {
        list,
        title,
        name,
      }
    }).catch(err => {
      console.log(err)
    })
    if (!res?.list) {
      const _date = dealFileDir(new Date().toISOString())
      const writerStream = fs.createWriteStream(`${mkdir('./output/error', [])}/error_${_date}.txt`);
      writerStream.write(`${chapterUrl}\r\n`)
      writerStream.end()
    }
    await page.close()
    console.log(`getImgOneChapter---Over::${JSON.stringify(res)}`)
    return res ? {
      list: res.list,
      title: dealFileDir(res.title),
      name: dealFileDir(res.name),
    } : undefined
  } catch (e) {
    console.error(e)
  }
}

export const outputUrl = async ({ list, title, name }) => {
  const _dir = mkdir('./output/book', [name, title])
  const writerStream = fs.createWriteStream(`${_dir}/imgs.txt`);
  writerStream.write(list.join('\r\n'))
  writerStream.end()
  return
}

export const getImgByChapterList = async (browser, chapterList, limit = 5) => {
  console.log(`start:: getImgByChapterList`)
  await eachLimitAwait(chapterList, limit, async (url) => {
    const data = await getImgOneChapter(browser, url)
    if (data) {
      await outputUrl(data)
      await downloadLimitAsync(data.list, mkdir('./output/img', [data.name, data.title]))
    }
  })
  console.log(`end:: getImgByChapterList`)
}

