import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models/user.model';

export interface MyUserTokenProfile extends UserProfile {
  [securityId]: string;
  id: string;
  email: string;
  name: string;
}

export function convertToMyUserProfile(user: User): MyUserTokenProfile {
  return {
    [securityId]: user.id!.toString(),
    id: user.id,
    email: user.email,
    name: user.name,
  } as MyUserTokenProfile;
}
