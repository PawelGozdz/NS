import { ProfileDto } from './profile.dto';

export class UserResponseDto {
	id: string;
	email: string;
	profile: ProfileDto;
}
