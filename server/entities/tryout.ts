import { Entity, Index, Column } from 'typeorm'
import { DomainBaseEntity } from '@things-factory/shell/server'

@Entity('tryouts')
@Index('ix_tryout_0', (tryout: TryOut) => [tryout.category, tryout.name], { unique: true })
export class TryOut extends DomainBaseEntity {
  @Column('text')
  name: string

  @Column('text')
  category: string

  @Column('text', {
    nullable: true
  })
  value: string
}
