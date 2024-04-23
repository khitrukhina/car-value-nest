import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockedUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [] as User[];
    mockedUsersService = {
      find: (email: string) => {
        const filtered = users.filter(u => u.email === email);
        return Promise.resolve(filtered);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999), email, password } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          AuthService,
          { provide: UsersService, useValue: mockedUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of AuthService', () => {
    expect(service).toBeDefined();
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
        service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('expect user to sign in', async () => {
    const email = 'qwert@gmail.com';
    const password = 'qwerty';
    await service.signup(email, password);
    const user = await service.signin(email, password);
    expect(user).toBeDefined();
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
        service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
        BadRequestException,
    );
  });

  it('creates new user with salted and hashed password', async () => {
    const password = 'qwerty';
    const user = await service.signup('email@gmail.com', password);
    expect(password).not.toEqual(user.password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
});
