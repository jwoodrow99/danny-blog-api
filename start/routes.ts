/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Auth routes
Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
}).prefix('/auth')

// User routes
Route.group(() => {
  Route.get('/', 'UserController.index')
  Route.get('/me', 'UserController.me')
})
  .prefix('/user')
  .middleware('jwt')

// User routes
Route.group(() => {
  Route.get('/', 'BlogController.index')
  Route.get('/:id', 'BlogController.show')
  Route.post('/', 'BlogController.store')
  Route.patch('/:id', 'BlogController.update')
  Route.delete('/:id', 'BlogController.destroy')
})
  .prefix('/blog')
  .middleware('jwt')

// Testing routes
const test = async (ctx: HttpContextContract) => {
  const { request, response } = ctx

  response.status(200)
  response.send({
    message: 'Welcome to danny-blog-api!',
    request: {
      headers: request.headers(),
      qs: request.qs(),
      params: request.params(),
      body: request.body(),
    },
  })
  return
}

Route.get('/', test)
Route.post('/test', test)
