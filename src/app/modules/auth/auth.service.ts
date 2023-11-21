import { Auth } from 'otentikasi';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';

export class AuthService extends Auth<User> {
  constructor(private userRepo: UserRepository) {
    super();
  }

  protected async createUser(credential: Partial<User>): Promise<User> {
    return await this.userRepo.create({
      values: {
        email: credential.email,
        name: credential.name,
        password: credential.password,
      },
    });
  }

  protected async findUserByEmail(email: string): Promise<User> {
    return await this.userRepo.readRow({
      filter: {
        email,
      },
    });
  }

  protected async findUserById(id: number): Promise<User | null> {
    return await this.userRepo.readRow({
      filter: {
        id,
      },
    });
  }
}
