import { userModel } from "../models/userModel";

const getUserByEmailIdAndPassword = (email: string, password: string) => {
  try {
    let user = userModel.findOne(email);
    if (user) {
      if (isUserValid(user, password)) {
        return { user, err: null };
      }
    }
  } catch (err: any) {
    return { user: null, err: err.message };
  }
};

const getUserById = (id: any) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

const getExternalUser = (email: string) => {
  const user = userModel.findExternalUser(email);
  if (user) {
    return user;
  }
  return null;
}

const addUser = (user: { id: number; name: string; email: string; password: string; role: string }) => {
  if (user) userModel.addUser(user)
}

function isUserValid(user: any, password: string) {
  if (user.password !== password) {
    throw new Error("Password is incorrect");
  }
  return true;
  // return user.password === password;
}

export {
  getUserByEmailIdAndPassword,
  getUserById, getExternalUser, addUser
};
