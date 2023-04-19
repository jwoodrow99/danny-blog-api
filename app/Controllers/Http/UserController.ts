import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Blog from 'App/Models/Blog'

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
        .withCount('followedBy')
        .withAggregate('followedBy', (query) => {
          query.where('user_id', request.all().user.id).count('*').as('followed_by_me')
        })
        .first()

      if (!user) {
        response.status(404)
        response.send({
          message: 'Cannot find user record.',
        })
        return
      }

      const formattedUser = {
        id: user.id,
        email: user.email,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        followed_by_count: user.$extras.followedBy_count,
        followed_by_me: user.$extras.followed_by_me,
      }

      response.status(200)
      response.send({
        message: 'User object',
        user: formattedUser,
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

  public async feed(ctx: HttpContextContract) {
    const { request, response } = ctx

    const usersFollowing: any = (
      await User.query().preload('following').where('id', request.all().user.id).first()
    )?.following

    let feed: any = []

    const feedQuery = Blog.query()
      .withAggregate('likes', (query) => {
        query.where('user_id', request.all().user.id).count('*').as('liked_by_me')
      })
      .preload('user')
      .orderBy('created_at', 'desc')
      .withCount('likes')

    for (const user of usersFollowing) {
      feedQuery.orWhere('user_id', user.id)
    }

    if (usersFollowing.length > 0) {
      feed = await feedQuery
    }

    const formattedFeed: any = feed.map((blog) => {
      return {
        id: blog.id,
        user_id: blog.userId,
        title: blog.title,
        article: blog.article,
        created_at: blog.createdAt,
        updated_at: blog.updatedAt,
        user: blog.user,
        likes_count: blog.$extras.likes_count,
        liked_by_me: blog.$extras.liked_by_me,
      }
    })

    try {
      response.status(200)
      response.send({
        message: 'Blogs of users you are following.',
        blogs: formattedFeed,
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

  public async follow(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const userToFollow = await User.query()
        .select('id', 'email', 'created_at', 'updated_at')
        .where('id', request.params().id)
        .withCount('followedBy')
        .withAggregate('followedBy', (query) => {
          query.where('user_id', request.all().user.id).count('*').as('followed_by_me')
        })
        .first()

      if (userToFollow?.$extras.followed_by_me) {
        response.status(400)
        response.send({
          message: 'You are already following this user.',
        })
        return
      }

      const requestingUser = await User.findOrFail(request.all().user.id)
      requestingUser.related('following').attach([request.params().id])

      response.status(200)
      response.send({
        message: 'Follow',
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

  public async unfollow(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const userToUnfollow = await User.query()
        .select('id', 'email', 'created_at', 'updated_at')
        .where('id', request.params().id)
        .withCount('followedBy')
        .withAggregate('followedBy', (query) => {
          query.where('user_id', request.all().user.id).count('*').as('followed_by_me')
        })
        .first()

      if (!userToUnfollow?.$extras.followed_by_me) {
        response.status(400)
        response.send({
          message: 'You are not following this user.',
        })
        return
      }

      const requestingUser = await User.findOrFail(request.all().user.id)
      requestingUser.related('following').detach([request.params().id])

      response.status(200)
      response.send({
        message: 'Unfollow',
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
