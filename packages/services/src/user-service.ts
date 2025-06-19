import { UserDto } from '@workspace/dto/*';
import { userRepository } from '@workspace/repository/*';

const userService = {
  async getUserByEmail(email: string) {
    const user = await userRepository.getUserByEmail(email);
    return UserDto.parse(user);
  },
};

export { userService };
