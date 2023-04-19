import Factory from '@ioc:Adonis/Lucid/Factory'

import User from 'App/Models/User'
import Blog from 'App/Models/Blog'
import Comment from 'App/Models/Comment'

import bcrypt from 'bcrypt'

export const UserFactory = Factory.define(User, async ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: await bcrypt.hash('password', 10),
  }
}).build()

export const BlogFactory = Factory.define(Blog, async ({ faker }) => {
  return {
    userId: 1,
    title: faker.lorem.words(3),
    article: faker.lorem.paragraphs(5),
  }
}).build()

export const CommentFactory = Factory.define(Comment, async ({ faker }) => {
  return {
    userId: 1,
    blogId: 1,
    text: faker.lorem.words(10),
  }
}).build()
