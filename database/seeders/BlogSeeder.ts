import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'
import Blog from 'App/Models/Blog'

export default class extends BaseSeeder {
  public async run() {
    const allUsers = await User.all()

    for (const user of allUsers) {
      await Blog.createMany(
        [...Array(5)].map((_, index) => {
          return {
            userId: user.id,
            title: `${user.email.split('@')[0]} blog post ${index}`,
            article: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean finibus consectetur nisl at luctus. Donec a rhoncus tellus. Curabitur augue lacus, egestas non justo sed, aliquet placerat magna. Donec purus velit, mattis id eleifend nec, vestibulum in mauris. Donec venenatis sodales orci, eu suscipit sapien dignissim ornare. Sed luctus commodo erat. Aliquam euismod purus in dolor egestas, nec molestie lorem fringilla. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent tempor elit eget nunc venenatis facilisis. Curabitur tempus nulla sed dolor lobortis porta. Nullam vel velit ac mauris consectetur cursus non vel dui. Praesent accumsan in nulla non laoreet.`,
          }
        })
      )
    }
  }
}
