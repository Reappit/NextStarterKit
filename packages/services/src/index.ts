import { userRepository } from '@workspace/repository/*';
import { UserDto } from '@workspace/dto/*';

const userService = {
  async getUserByEmail(email: string) {
    const user = await userRepository.getUserByEmail(email);
    return UserDto.parse(user);
  },
};

export default userService;
