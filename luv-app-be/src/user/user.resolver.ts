import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { User } from '@src/user/schemas/user.schema';
import { CreateUserInput } from '@src/user/dto/create-user.dto';
import { UpdateUserInput } from '@src/user/dto/update-user.dto';

@Resolver(() => User)
@UsePipes(new ValidationPipe({ transform: true }))
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  // @UseGuards(JwtAuthGuard) // Uncomment when auth is implemented
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  // @UseGuards(JwtAuthGuard)
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.findOne(id);
  }

}
