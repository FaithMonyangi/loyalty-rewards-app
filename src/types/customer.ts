
export interface Customer {
  id: string;
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  createdAt: string;
  rewardGiven?: boolean;
}

export interface Visit {
  id: string;
  customerId: string;
  visitDate: string;
}
