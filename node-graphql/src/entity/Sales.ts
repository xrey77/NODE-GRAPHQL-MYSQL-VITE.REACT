import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID, Float } from "type-graphql";
import { GraphQLDate } from "graphql-scalars";

export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@ObjectType() 
@Entity()
export class Sales {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        type: 'decimal', 
        precision: 10, 
        scale: 2, 
        default: 0,
        transformer: new ColumnNumericTransformer()
    })
    @Field(() => Float)
    amount: number;

    @Column({ type: 'date' })
    @Field(() => GraphQLDate)     
    date: Date;
}
