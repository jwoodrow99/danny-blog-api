import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../UserSeeder'))
    await this.runSeeder(await import('../BlogSeeder'))
    await this.runSeeder(await import('../LikeSeeder'))
    await this.runSeeder(await import('../CommentSeeder'))
    await this.runSeeder(await import('../FollowSeeder'))
  }
}
