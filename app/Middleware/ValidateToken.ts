import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

import jwt from 'jsonwebtoken'
import { appKey } from 'Config/app'

export default class ValidateToken {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    // Check if header exists
    if (!request.header('Authorization')) {
      response.status(401)
      response.send({
        message: 'Authorization header is missing.',
      })
      return
    }

    // Split Authorization header
    const token = request.header('Authorization')?.split(' ')[1]

    // Decode JWT and return null if error
    const decoded = jwt.verify(token, appKey, (error, decoded) => {
      if (error !== null) {
        return null
      }
      return decoded
    })

    // If decoded is null return error
    if (!decoded) {
      response.status(401)
      response.send({
        message: 'Authorization token is malformed.',
      })
      return
    }

    // Find associated user and attach to request
    const matchingUser = await User.query()
      .select('id', 'email', 'created_at', 'updated_at')
      .where('id', decoded.data.user.id)
      .first()

    if (!matchingUser) {
      response.status(404)
      response.send({
        message: 'Cannot find matching user.',
      })
      return
    }

    // Attach user to request object
    request.all().user = matchingUser

    await next()
  }
}
