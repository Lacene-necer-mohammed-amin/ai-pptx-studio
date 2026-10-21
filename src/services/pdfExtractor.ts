import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerSrc

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const data = new Uint8Array(await file.arrayBuffer())
  const pdf = await getDocument({ data }).promise

  const pages: string[] = []
  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim()

    if (pageText) {
      pages.push(pageText)
    }
  }

  return pages.join('\n\n')
}
