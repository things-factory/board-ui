import { MigrationInterface, QueryRunner, getRepository } from 'typeorm'
import { Domain } from '@things-factory/shell'
import { TryOut } from '../entities/tryout'

const SEED_TRYOUT = [
  {
    name: 'tryout 1'
  },
  {
    name: 'tryout 2'
  }
]

export class Tryouts1557729581170 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const domainRepository = getRepository(Domain)
    const domain = await domainRepository.findOne({
      name: 'SYSTEM'
    })

    const repository = getRepository(TryOut)

    try {
      SEED_TRYOUT.forEach(async tryout => {
        await repository.save({
          ...tryout,
          domain
        })
      })
    } catch (e) {
      console.error(e)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository(TryOut)
    SEED_TRYOUT.forEach(async tryout => {
      let recode = await repository.findOne({ name: tryout.name })
      await repository.remove(recode)
    })
  }
}
