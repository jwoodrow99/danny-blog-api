import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/Users'
import bcrypt from 'bcrypt'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'user1@example.test',
        password: await bcrypt.hash('password', 10),
      },
      {
        email: 'user2@example.test',
        password: await bcrypt.hash('password', 10),
      },
      {
        email: 'user3@example.test',
        password: await bcrypt.hash('password', 10),
      },
      {
        email: 'user4@example.test',
        password: await bcrypt.hash('password', 10),
      },
      {
        email: 'user5@example.test',
        password: await bcrypt.hash('password', 10),
      },
    ])
  }
}
