import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'
import Blog from 'App/Models/Blog'
import Like from 'App/Models/Like'

export default class extends BaseSeeder {
  public async run() {
    const allUsers = await User.all()

    for (const user of allUsers) {
      const blogs = await Blog.query().where('user_id', '!=', user.id)

      const numberOfLoops = [...Array(10)]

      for (const index of numberOfLoops) {
        const randomBlog = blogs[Math.floor(Math.random() * blogs.length)]
        await Like.create({
          userId: user.id,
          blogId: randomBlog.id,
        })
      }
    }
  }
}
