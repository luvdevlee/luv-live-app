import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user.response';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserResponse)
  createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Query(() => [UserResponse], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => UserResponse, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOne(id);
  }

  @Query(() => UserResponse, { name: 'userByUsername' })
  findByUsername(@Args('username', { type: () => String }) username: string) {
    return this.userService.findByUsername(username);
  }

  @Mutation(() => UserResponse)
  updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Mutation(() => UserResponse)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.remove(id);
  }
}
