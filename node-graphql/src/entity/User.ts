import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType() 
@Entity()
export class User {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255 })    
    firstname: string;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255 })    
    lastname: string;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255, unique: true })    
    email: string;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255, nullable: true })    
    mobile: string;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255, unique: true })    
    username: string;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255 })    
    password: string;

    @Field(() => Int)    
    @Column({ type: "int", default: 1 })
    isactivated: number;

    @Field(() => Int)    
    @Column({ type: "int", default: 0 })
    isblocked: number;

    @Field(() => Int)    
    @Column({ type: "int", default: 0 })
    mailtoken: number;

    @Field(() => String, { nullable: true }) 
    @Column({ type: "text", nullable: true })
    secret?: string | null;

    @Field(() => String, { nullable: true }) 
    @Column({ type: "text", nullable: true })
    qrcodeurl?: string | null;

    @Field(() => String)    
    @Column({ type: "varchar", length: 255, default: "pix.png" })    
    userpic: string;

    @Field(() => Date)    
    @CreateDateColumn({ type: "timestamp", name: "created_at" })
    createdAt: Date;

    @Field(() => Date)    
    @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
    updatedAt: Date;  

}

