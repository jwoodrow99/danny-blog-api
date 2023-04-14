import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'

import Blog from 'App/Models/Blog'

export default class BlogController {
  public async index(ctx: HttpContextContract) {
    const { request, response } = ctx

    const blogs = Database.from('blogs').select('*')

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

    response.status(200)
    response.send({
      message: 'Blogs',
      blogs: await blogs,
    })
    return
  }

  public async show(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const blog = await Blog.findOrFail(request.params().id)

      response.status(200)
      response.send({
        message: 'Blog',
        blog: blog,
      })
      return
    } catch (error) {
      response.status(404)
      response.send({
        message: 'Cannot find blog record.',
      })
      return
    }
  }

  public async store(ctx: HttpContextContract) {
    const { request, response } = ctx

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
  }

  public async update(ctx: HttpContextContract) {
    const { request, response } = ctx

    if (!request.body().title || !request.body().article) {
      response.status(500)
      response.send({
        message: 'Missing required form data.',
      })
      return
    }

    try {
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
      response.status(404)
      response.send({
        message: 'Cannot find blog record.',
      })
      return
    }
  }

  public async destroy(ctx: HttpContextContract) {
    const { request, response } = ctx

    try {
      const blog = await Blog.findOrFail(request.params().id)
      await blog.delete()
      response.status(200)
      response.send({
        message: 'Blog has been removed.',
      })
      return
    } catch (error) {
      response.status(404)
      response.send({
        message: 'Cannot find blog record.',
      })
      return
    }
  }
}