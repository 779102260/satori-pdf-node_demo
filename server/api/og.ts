/**
 * satori 生成pdf
 * 使用node比在纯前端环境跑更简单些
 */
import * as fs from 'fs/promises'
import * as fs2 from 'fs'
import { join } from 'path'
import type { SatoriOptions } from 'satori'
// import satori from 'satori'
import { satori } from 'v-satori'
import { eventHandler, getQuery } from 'h3'

// 1. 导入模板文件
// - CSS HTML 都受限 TODO
import Image from '@/components/sfc.vue'

import PDFDocument from 'pdfkit/js/pdfkit.standalone.js'
import SVGtoPDF from 'svg-to-pdfkit'

async function initFonts(): Promise<SatoriOptions['fonts']> {
  let fontData: Buffer

  if (process.env.NODE_ENV === 'development') {
    const fontPath = join(process.cwd(), 'public', 'fonts', 'Roboto-Bold.ttf')
    fontData = await fs.readFile(fontPath)
  }
  else {
    // TODO: Fix this
   fontData = await $fetch('https://v-satori.vercel.app/fonts/Roboto-Bold.ttf', {
      responseType: 'arrayBuffer',
    }) 
  }

  return [
    {
      name: 'Inter',
      data: fontData,
      weight: 400,
      style: 'normal',
    },
  ]
}

export default eventHandler(async (event) => {
  const fonts = await initFonts()

  const query = getQuery(event) as Record<string, string>

  // 2. 传入数据
  // 3. 转为svg
  const svg = await satori(Image, {
    debug: true, // debug
    props: {
      title: query.title || 'OG Image Generator using Nuxt and Satori',
      website: query.website || 'v-satori.vercel.app',
    },
    width: 1200,
    height: 627,
    fonts,
  })

  // 4. pdf
  const doc = new PDFDocument({compress: false});
  SVGtoPDF(doc, svg, 0, 0);

  // 直接写到文件里
  // 或者将流传给前端
  doc.pipe(fs2.createWriteStream('output.pdf'));
  doc.end();

  return 'ok'
})
