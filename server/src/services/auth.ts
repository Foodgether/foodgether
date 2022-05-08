import bcrypt from 'bcryptjs';

export const hashPin = async (pin: string) => bcrypt.hash(pin, 10);

export const compareHash = async (pin: string, hash: string) => bcrypt.compare(pin, hash);
