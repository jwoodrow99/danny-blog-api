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

// Auth routes
Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
}).prefix('/auth')

// User routes
Route.group(() => {
  Route.get('/', 'UserController.index')
  Route.get('/me', 'UserController.me')
  Route.get('/feed', 'UserController.feed')
  Route.get('/:id', 'UserController.show')
  Route.post('/:id/follow', 'UserController.follow')
  Route.delete('/:id/follow', 'UserController.unfollow')
})
  .prefix('/user')
  .middleware('jwt')

// Blog routes
Route.group(() => {
  Route.get('/', 'BlogController.index')
  Route.get('/:id', 'BlogController.show')
  Route.post('/', 'BlogController.store')
  Route.patch('/:id', 'BlogController.update')
  Route.post('/:id/like', 'BlogController.createLike')
  Route.post('/:id/comment', 'BlogController.comment')
  Route.delete('/:id/like', 'BlogController.destroyLike')
  Route.delete('/:id', 'BlogController.destroy')
})
  .prefix('/blog')
  .middleware('jwt')
