export class Email {
  private _address: string;

  constructor(address: string) {
    if (!this.isValidEmail(address)) {
      throw new Error("Invalid email address");
    }
    this._address = address.toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get address(): string {
    return this._address;
  }
}
