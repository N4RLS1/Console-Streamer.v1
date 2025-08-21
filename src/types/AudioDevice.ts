export interface AudioDevice {
  id: string;
  name: string;
  channels: number;
  status: 'active' | 'inactive' | 'error';
}