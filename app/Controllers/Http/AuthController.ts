import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/Users'

import { appKey } from 'Config/app'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class AuthController {
  public async register(ctx: HttpContextContract) {
    const { request } = ctx

    const duplicateUser = await User.query().where('email', request.body().email).first()

    // Check if duplicate user exists
    if (duplicateUser) {
      ctx.response.status(500)
      return {
        message: 'Duplicate user email.',
      }
    }

    // Create new user
    await User.create({
      email: request.body().email,
      password: await bcrypt.hash(request.body().password, 10),
    })

    return {
      message: 'New user created, you can lon login!',
    }
  }

  public async login(ctx: HttpContextContract) {
    const { request } = ctx

    // Find matching user email
    const user = await User.query().where('email', request.body().email).first()

    // Check if duplicate user exists
    if (!user) {
      ctx.response.status(404)
      return {
        message: 'No matching email found.',
      }
    }

    // Check if authenticated
    const authCheck = await bcrypt.compare(request.body().password, user.password)
    if (!authCheck) {
      ctx.response.status(401)
      return {
        message: 'Password is not valid.',
      }
    }

    const exp = Number(Date.now()) + 1000 * 60 * 60 * 24 * 1 // milliseconds * seconds * minutes * hours * days

    // Create JWT
    const token = jwt.sign(
      {
        iss: 'danny-blog-api',
        exp: exp,
        sub: 'user_auth',
        aud: user.id,
        data: {
          user: {
            id: user.id,
            email: user.email,
          },
        },
      },
      appKey
    )

    return {
      message: 'Successful login',
      access_token: token,
    }
  }
}
