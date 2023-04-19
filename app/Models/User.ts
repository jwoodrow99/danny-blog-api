import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Blog from 'App/Models/Blog'
import Like from 'App/Models/Like'
import Comment from 'App/Models/Comment'

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Blog)
  public blogs: HasMany<typeof Blog>

  @hasMany(() => Like)
  public likes: HasMany<typeof Like>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @manyToMany(() => User, {
    pivotTable: 'user_follows',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'following_user_id',
  })
  public following: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'user_follows',
    localKey: 'id',
    pivotForeignKey: 'following_user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  public followedBy: ManyToMany<typeof User>
}
