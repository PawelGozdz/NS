import { v4 as uuidV4 } from 'uuid';

type UUID = 'v4';

export class AppUtils {
	static getUUID(type?: UUID) {
		if (type === 'v4') {
			return uuidV4();
		}

		return uuidV4();
	}
}
