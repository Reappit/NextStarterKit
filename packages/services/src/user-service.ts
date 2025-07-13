import { UserDto } from '@reappit/dto/*';
import { userRepository } from '@reappit/repository/*';

const userService = {
  async getUserByEmail(email: string) {
    const user = await userRepository.getUserByEmail(email);
    return UserDto.parse(user);
  },
};

export { userService };
