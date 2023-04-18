import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import { UserFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run() {
    await UserFactory.merge({ email: 'johndoe@example.test' }).create()
    await UserFactory.createMany(10)
  }
}
