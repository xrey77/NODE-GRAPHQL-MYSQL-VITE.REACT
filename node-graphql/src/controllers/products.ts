import {Request, Response} from 'express';
import { getPaginatedListProducts } from '../middleware/paginate.products.js';
import { getPaginatedSearchProducts } from '../middleware/paginate.products.js';
export async function getProductbyid(req: Request, res: Response) {
    const id = req.params.id; 

    res.status(200).json({
        id: id,
        message: 'Data received successfully',
      });

}

export async function getProductList(req: Request, res: Response) {
  let page: any = req.params.page; 

  try {
      const paginatedResult = await getPaginatedListProducts(page);
      if (paginatedResult.data.length > 0) {

        const totalpage = Math.ceil(paginatedResult.count / 5);
        const data = {
          page: page,
          totalrecords: paginatedResult.count,
          totpage: totalpage ,
          products: paginatedResult.data
        }
        res.status(200).json(data);
      } else {
        res.status(500).json({ message: 'Products not found.' });
      }
  

  } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
  }

}

export async function getProductSearch(req: Request, res: Response) {
  let page: any = req.params.page; 
  let key: any = req.params.key;
  try {
      const paginatedResult = await getPaginatedSearchProducts(page, key);
      if (paginatedResult.data.length > 0) {

      const totalpage = Math.ceil(paginatedResult.count / 5);
      const data = {
        page: page,
        totalrecords: paginatedResult.count,
        totpage: totalpage ,
        products: paginatedResult.data
      }
      res.status(200).json(data);
    } else {
      res.status(500).json({ message: 'Products not found.' });
    }
  } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
  }


}