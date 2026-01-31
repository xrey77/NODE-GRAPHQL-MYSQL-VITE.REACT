import { Like } from 'typeorm';
import { AppDataSource } from '../data-source.js';
import { Product } from '../entity/Product.js';
// import { AppDataSource } from '../data-source';
// import { Product } from '../entities/products';

export const getPaginatedListProducts = async (page: number): Promise<{ data: Product[], count: number }> => {

    const productRepository = AppDataSource.getRepository(Product);
    const perPage = 5;
    const offset = Math.ceil((page - 1) * perPage);

    const [result, total] = await productRepository.findAndCount({        
        select: ['id','descriptions','qty','unit','sellprice','productpicture'],
        order: { id: "ASC" },
        take: perPage,
        skip: offset,
    });

    return {
        data: result,
        count: total
    };
};

export const getPaginatedSearchProducts = async (page: number, keyword: string = ''): Promise<{ data: Product[], count: number }> => {
    const productRepository = AppDataSource.getRepository(Product);

    const perPage = 5;
    const offset = Math.ceil((page - 1) * perPage);

    const [result, total] = await productRepository.findAndCount({        
    select: ['id','descriptions','qty','unit','sellprice','productpicture'],
    where: { descriptions: Like(`%${keyword}%`) },
    order: { id: "ASC" },
        take: perPage,
        skip: offset,
    });

    return {
        data: result,
        count: total
    };
};