export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  balance: number;
  rank: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Master";
  tier: number;
  wins: number;
  losses: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  gameName: string;
  category: string;
  description: string;
  type: "online" | "offline";
  location?: string;
  entryFee: number;
  prizePool: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  maxPlayers: number;
  currentPlayers: number;
  startDate: string;
  creatorId: string;
  winnerId?: string;
  image?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "deposit" | "withdrawal" | "entry_fee" | "prize_win";
  status: "pending" | "completed" | "failed";
  method: string;
  createdAt: string;
}
