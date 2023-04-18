import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'

import { BlogFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run() {
    const allUsers = await User.all()

    for (const user of allUsers) {
      await BlogFactory.merge({ userId: user.id }).createMany(10)
    }
  }
}
