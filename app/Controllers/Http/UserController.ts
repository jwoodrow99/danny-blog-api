import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UserController {
  public async index(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const allUsers = await User.query().select('id', 'email', 'created_at', 'updated_at')
      return {
        message: 'All users',
        users: allUsers,
      }
    } catch (error) {
      response.status(500)
      response.send({
        message: 'Server error.',
      })
      return
    }
  }

  public async show(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
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
    } catch (error) {
      response.status(500)
      response.send({
        message: 'Server error.',
      })
      return
    }
  }

  public async me(ctx: HttpContextContract) {
    const { request, response } = ctx

    const userAndFollows = await User.query()
      .preload('following')
      .preload('followedBy')
      .where('id', request.all().user.id)
      .first()

    try {
      response.status(200)
      response.send({
        message: 'Your user object',
        user: userAndFollows,
      })
      return
    } catch (error) {
      response.status(500)
      response.send({
        message: 'Server error.',
      })
      return
    }
  }
}
