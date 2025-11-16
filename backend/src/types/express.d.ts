declare namespace Express {
  export interface Request {
    chain?: string;
  }

  export interface Wallet {
    _id?: import('mongodb').ObjectId;
    userId: string;
    name: string;
    address: string;
    chain: string;
  }
}
