import {securityId, UserProfile as LBUserProfile} from '@loopback/security';

export interface MyUserProfile extends LBUserProfile {
  [securityId]: string;
  id: string;
  name: string;
  email: string;
}
