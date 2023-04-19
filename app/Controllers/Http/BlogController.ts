import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Blog from 'App/Models/Blog'
import Like from 'App/Models/Like'
import Comment from 'App/Models/Comment'

export default class BlogController {
  public async index(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const blogs = Blog.query()
        .preload('user')
        .withCount('likes')
        .withAggregate('likes', (query) => {
          query.where('user_id', request.all().user.id).count('*').as('liked_by_me')
        })

      // Search
      if (request.qs().search) {
        const [field, searchString] = request.qs().search.split(':')
        blogs.whereLike(field, `%${searchString}%`)
      }

      // Order
      if (request.qs().order_by) {
        const [field, method] = request.qs().order_by.split(':')
        blogs.orderBy(field, method)
      }

      // Pagination
      if (request.qs().page && request.qs().limit) {
        blogs.paginate(request.qs().page, request.qs().limit)
      }

      const matchingBlogs = await blogs

      const formattedBlogs: any = matchingBlogs.map((blog) => {
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

      response.status(200)
      response.send({
        message: 'Blogs',
        blogs: formattedBlogs,
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

  public async show(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const blog: any = await Blog.query()
        .preload('comments', (userQuery) => {
          userQuery.orderBy('createdAt', 'desc').preload('user', (userQuery) => {
            userQuery.select('id', 'email', 'created_at', 'updated_at')
          })
        })
        .preload('user', (userQuery) => {
          userQuery.withCount('followedBy').withAggregate('followedBy', (query) => {
            query.where('user_id', request.all().user.id).count('*').as('followed_by_me')
          })
        })
        .withCount('likes')
        .withAggregate('likes', (query) => {
          query.where('user_id', request.all().user.id).count('*').as('liked_by_me')
        })
        .where('id', request.params().id)
        .first()

      const formattedBlog = {
        id: blog.id,
        user_id: blog.userId,
        title: blog.title,
        article: blog.article,
        created_at: blog.createdAt,
        updated_at: blog.updatedAt,
        user: {
          id: blog.user.id,
          email: blog.user.email,
          created_at: blog.user.createdAt,
          updated_at: blog.user.updatedAt,
          followed_by_count: blog.user.$extras.followedBy_count,
          followed_by_me: blog.user.$extras.followed_by_me,
        },
        likes_count: blog.$extras.likes_count,
        liked_by_me: blog.$extras.liked_by_me,
        comments: blog.comments,
      }

      response.status(200)
      response.send({
        message: 'Blog',
        blog: formattedBlog,
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

  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      if (!request.body().title || !request.body().article) {
        response.status(500)
        response.send({
          message: 'Missing required form data.',
        })
        return
      }

      const newBlog = await Blog.create({
        userId: request.all().user.id,
        title: request.body().title,
        article: request.body().article,
      })

      response.status(200)
      response.send({
        message: 'New blog entry created.',
        blog: newBlog,
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

  public async update(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      if (!request.body().title || !request.body().article) {
        response.status(500)
        response.send({
          message: 'Missing required form data.',
        })
        return
      }

      const blog = await Blog.findOrFail(request.params().id)

      if (blog.userId !== request.all().user.id) {
        response.status(401)
        response.send({
          message: 'You cannot edit this resource.',
        })
        return
      }

      blog.title = request.body().title
      blog.article = request.body().article
      blog.save()

      response.status(200)
      response.send({
        message: 'Blog has been updated.',
        blog: blog,
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

  public async createLike(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const blog: any = await Blog.query()
        .withAggregate('likes', (query) => {
          query.where('user_id', request.all().user.id).count('*').as('liked_by_me')
        })
        .where('id', request.params().id)
        .first()

      if (!blog.$extras.liked_by_me) {
        await Like.create({
          userId: request.all().user.id,
          blogId: blog.id,
        })
      } else {
        response.status(400)
        response.send({
          message: 'Blog is already liked.',
        })
        return
      }

      response.status(200)
      response.send({
        message: 'Blog has updated like.',
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

  public async destroyLike(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const blog: any = await Blog.query()
        .withAggregate('likes', (query) => {
          query.where('user_id', request.all().user.id).count('*').as('liked_by_me')
        })
        .where('id', request.params().id)
        .first()

      if (blog.$extras.liked_by_me) {
        await Like.query()
          .where('user_id', request.all().user.id)
          .where('blog_id', blog.id)
          .delete()
      } else {
        response.status(400)
        response.send({
          message: 'Blog is already liked.',
        })
        return
      }

      response.status(200)
      response.send({
        message: 'Blog has updated like.',
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

  public async destroy(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const blog = await Blog.findOrFail(request.params().id)

      if (blog.userId !== request.all().user.id) {
        response.status(401)
        response.send({
          message: 'You cannot delete this resource.',
        })
        return
      }

      await blog.delete()
      response.status(200)
      response.send({
        message: 'Blog has been removed.',
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

  public async comment(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      if (!request.body().text) {
        response.status(500)
        response.send({
          message: 'Missing required form data.',
        })
        return
      }

      const newComment = await Comment.create({
        userId: request.all().user.id,
        blogId: request.params().id,
        text: request.body().text,
      })

      const formattedComment = {
        id: newComment.id,
        user_id: newComment.userId,
        blog_id: newComment.blogId,
        text: newComment.text,
        user: request.all().user,
      }

      response.status(200)
      response.send({
        message: 'New comment entry created.',
        comment: formattedComment,
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
