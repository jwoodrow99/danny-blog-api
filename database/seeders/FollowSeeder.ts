import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    const allUsers = await User.all()

    for (const user of allUsers) {
      const otherUsers = await User.query().where('id', '!=', user.id)
      const numberOfLoops = [...Array(3)]
      for (const index of numberOfLoops) {
        const randomIndex = Math.floor(Math.random() * otherUsers.length)
        const randomOtherUser = otherUsers[randomIndex]
        otherUsers.splice(randomIndex, 1)
        await user.related('following').attach([randomOtherUser.id])
      }
    }
  }
}
