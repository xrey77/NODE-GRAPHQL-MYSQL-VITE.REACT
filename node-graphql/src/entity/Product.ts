import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID, Int } from "type-graphql"; // Example library
import { Decimal128 } from "typeorm/browser";

@ObjectType() 
@Entity()
export class Product {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255 })    
    category: string;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255, unique: true })    
    descriptions: string;

    @Field(() => Int)    
    @Column({ type: "int", default: 0 })
    qty: number;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255 })    
    unit: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    costprice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    sellprice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    saleprice: number;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255, nullable: true })    
    productpicture: string;

    @Field(() => Int)    
    @Column({ type: "int", default: 0 })
    alertstocks: number;

    @Field(() => Int)    
    @Column({ type: "int", default: 0 })
    criticalstocks: number;

    @Field(() => Date)    
    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    createdAt: Date;

    @Field(() => Date)    
    @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
    updatedAt: Date;  
}

