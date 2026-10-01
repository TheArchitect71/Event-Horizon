export interface Person {
  id: string;
  name: string;
  role: string;
  organization: string;
  status: string;
  expertise: string;
  notes: string;
  spaceWalks?: number;
  spaceFlights?: number;
  missions?: string;
  almaMater?: string;
}
export type PersonInput = Omit<Person, 'id'>;
