import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UserController {
  public async index(ctx: HttpContextContract) {
    const { request } = ctx

    const allUsers = User.query().select('id', 'email', 'created_at', 'updated_at')

    return {
      message: 'Your user object',
      users: await allUsers,
    }
  }

  public async show(ctx: HttpContextContract) {
    const { request, response } = ctx

    const user = await User.query()
      .select('id', 'email', 'created_at', 'updated_at')
      .where('id', request.params().id)
      .first()

    if (!user) {
      response.status(404)
      response.send({
        message: 'Cannot find user record.',
      })
      return
    }

    response.status(200)
    response.send({
      message: 'User object',
      user: user,
    })
    return
  }

  public async me(ctx: HttpContextContract) {
    const { request } = ctx

    return {
      message: 'Your user object',
      user: request.all().user,
    }
  }
}
