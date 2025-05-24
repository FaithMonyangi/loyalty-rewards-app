
// Simple localStorage-based database for demo purposes
// In production, this would connect to a real database

export class Database {
  private static CUSTOMERS_KEY = 'loyalty_customers';
  private static VISITS_KEY = 'loyalty_visits';

  static getCustomers(): any[] {
    const data = localStorage.getItem(this.CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveCustomers(customers: any[]): void {
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
  }

  static getVisits(): any[] {
    const data = localStorage.getItem(this.VISITS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveVisits(visits: any[]): void {
    localStorage.setItem(this.VISITS_KEY, JSON.stringify(visits));
  }

  static addCustomer(customer: any): void {
    const customers = this.getCustomers();
    customers.push(customer);
    this.saveCustomers(customers);
  }

  static updateCustomer(updatedCustomer: any): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === updatedCustomer.id);
    if (index !== -1) {
      customers[index] = updatedCustomer;
      this.saveCustomers(customers);
    }
  }

  static findCustomerByPhone(phone: string): any | null {
    const customers = this.getCustomers();
    return customers.find(c => c.phone === phone) || null;
  }

  static addVisit(visit: any): void {
    const visits = this.getVisits();
    visits.push(visit);
    this.saveVisits(visits);
  }

  static getCustomerVisits(customerId: string): any[] {
    const visits = this.getVisits();
    return visits.filter(v => v.customerId === customerId);
  }
}
