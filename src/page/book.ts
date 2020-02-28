import fs from "fs"
import {dealFileDir, mkdir} from "../common/util"
import {getImgByChapterList} from "./page"

export const getAllChapter = async (browser, bookUrl) => {
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)
  await page.goto(bookUrl)
  const res = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('.chapter-list a')).map(v => v['href'])
    const titleList = Array.from(document.querySelectorAll('.chapter-list a')).map(v => v['innerText'])
    const name = document.querySelector('.title-warper .title')['innerText']
    return {
      list,
      name,
      titleList,
    }
  }).catch(err => {
    console.log(err)
  })
  await page.close()
  return res ? {
    list: res.list,
    name: dealFileDir(res.name),
    titleList: res?.titleList?.map(dealFileDir),
  } : undefined
}

export const outputChapter = async (data) => {
  const writerStream = fs.createWriteStream(`${mkdir('./output/book', [data.name])}/chapters.txt`);
  writerStream.write(data.list.join('\r\n'))
  writerStream.write(data.list.reduce((previousValue, currentValue, index) => `${previousValue}\r\n${currentValue}\r\n${data?.titleList?.[index]}\r\n`, '\r\n'))
  writerStream.end()
}

export const getAllBookImg = async (browser, url, dealList: (d: string[]) => string[] = d => d) => {
  const res = await getAllChapter(browser, url)
  await outputChapter(res)
  await getImgByChapterList(browser, dealList(res.list))
}
