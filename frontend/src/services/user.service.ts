import { v4 as uuidv4 } from "uuid";

import supabase from "../supabase";
import { timestamp } from "../util";
import { NutritionUser } from "../schema.type";

// Read all users
export const getUsers = async (callback: (users: NutritionUser[]) => void) => {
  const { data: users, error } = await supabase.from("users").select("*");
  if (users) {
    callback(users);
    console.log(timestamp(), "| Got users:", users);
  } else if (error) {
    console.error(timestamp(), "| Error getting users:", error);
  }
};

// Read all users in realtime
export const getUsersRealtime = async (callback: (users: NutritionUser[]) => void) => {
  getUsers(callback);
  return supabase
    .channel("users")
    .on("postgres_changes", { event: "*", schema: "public", table: "users" }, (payload) => {
      console.log(timestamp(), "| Got users realtime callback:", payload);
      getUsers(callback);
    })
    .subscribe();
};

// Unsubscribe from the users channel
export const unsubscribeUsersChannel = () => {
  supabase.removeChannel(supabase.channel("users"));
  console.log(timestamp(), "| Unsubscribed to users channel");
};

// Create a new user
export const addUser = async (user: Omit<NutritionUser, "docId">): Promise<String> => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ docId: uuidv4(), ...user }])
    .select();
  if (data) {
    console.log(timestamp(), "| Added user:", user);
    return data[0].docId;
  } else if (error) {
    console.error("Error adding user:", error);
  }
};

// Update a user
export const updateUser = async (
  userId: String,
  updates: Partial<NutritionUser>
): Promise<void> => {
  const { data, error } = await supabase.from("users").update(updates).eq("uid", userId).select();
  if (data) {
    console.log(timestamp(), "| Updated user:", data);
  } else if (error) {
    console.error("Error adding user:", error);
  }
};

// Delete a user
export const deleteUser = async (userId: String): Promise<void> => {
  const { error } = await supabase.from("users").delete().eq("uid", userId);
  if (error) {
    console.error("Error deleting user:", error);
  }
};
