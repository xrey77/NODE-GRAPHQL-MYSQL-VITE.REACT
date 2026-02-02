import puppeteer from 'puppeteer';
import { Resolver, Query } from 'type-graphql';
import { AppDataSource } from '../data-source.js';
import { Product } from '../entity/Product.js';
import fs from 'node:fs';
import path from 'node:path';

@Resolver()
export class ProductReport {
  @Query(() => String)
  async generateProductPdf(): Promise<string> {
    const products = await AppDataSource.getRepository(Product).find();
    if (!products || products.length === 0) throw new Error("No Record(s) found.");

    const tableRows = products.map(p => `
      <tr>
        <td style="font-family: Helvetica; text-align: center; border: 1px solid #ddd; padding: 8px;">${p.id}</td>
        <td style="font-family: Helvetica; border: 1px solid #ddd; padding: 8px;">${p.descriptions}</td>
        <td style="font-family: Helvetica; text-align: center; border: 1px solid #ddd; padding: 8px;">${p.qty}</td>
        <td style="font-family: Helvetica; text-align: center; border: 1px solid #ddd; padding: 8px;">${p.unit}</td>
        <td style="font-family: Helvetica; text-align: center; border: 1px solid #ddd; padding: 8px;">${p.sellprice}</td>
      </tr>
    `).join('');

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedDate = dateFormatter.format(new Date());
    const logoPath = path.join(import.meta.dirname, '../../public/images', 'logo.png');
    const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
    const logoSrc = `data:image/png;base64,${logoBase64}`;

    const htmlContent = `
      <html>
      <title>Products Report</title>
        <body style="font-family: Helvetica; padding: 20px;">
          <img src="${logoSrc}" alt="Logo" style="width: 150px; margin-bottom: 5px;"/>
          <h1 style="text-align: left; font-size: 24px;margin-top: -5px">Products Report</h1>
          <p style="font-size: 14px;margin-top: -10px;">As of ${formattedDate}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #333; color: white;">
                <th style="padding: 10px;">ID</th>
                <th style="padding: 10px;">Description</th>
                <th style="padding: 10px;">Qty</th>
                <th style="padding: 10px;">Unit</th>
                <th style="padding: 10px;">SellPrice</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files'] 
    });
    
    try {

      const page = await browser.newPage();
      await page.setContent(htmlContent, { 
        waitUntil: 'domcontentloaded',
        timeout: 0
      });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: `
          <div style="font-family: Helvetica; font-size: 10px; width: 100%; text-align: center; padding-bottom: 10px;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `,
        margin: { 
          top: '40px', 
          bottom: '60px', // Increased margin to accommodate footer
          left: '20px', 
          right: '20px' 
        }
      });
      
      return Buffer.from(pdfBuffer).toString('base64');

    } catch(error: any) {
      console.log(error.message);
      throw new Error(`Failed to generate PDF: ${error.message}`);       
    } finally {
      await browser.close();
    }
  }
}