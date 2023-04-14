import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UserController {
  public async index(ctx: HttpContextContract) {
    // const { request } = ctx

    const allUsers = await User.all()

    return {
      message: 'Your user object',
      users: allUsers,
    }
  }

  public async me(ctx: HttpContextContract) {
    const { request } = ctx

    return {
      message: 'Your user object',
      user: {
        id: request.all().user.id,
        email: request.all().user.email,
      },
    }
  }
}
