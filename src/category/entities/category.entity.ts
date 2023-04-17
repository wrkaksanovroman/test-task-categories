import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Category {
  @ApiProperty({ required: false })
  @PrimaryColumn()
  id: string;

  @ApiProperty()
  @Column({
    unique: true,
  })
  slug: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ required: false })
  @Column({
    nullable: true,
  })
  description?: string;

  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    name: 'created_date',
  })
  createdDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({ message: 'значение должно быть логическим' })
  @Column()
  active: boolean;
}
