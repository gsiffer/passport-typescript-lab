export { }

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      role: string
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    messages: string[]; // Define the 'messages' property
    passport: {
      user: number; // Assuming the user ID is of number type
    };
  }
}