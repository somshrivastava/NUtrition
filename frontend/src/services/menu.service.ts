import { v4 as uuidv4 } from "uuid";

import supabase from "../supabase";
import { timestamp } from "../util";
import { Menu } from "../schema.type";

// Read all menus
export const getMenus = async (callback: (menus: Menu[]) => void) => {
  const { data: menus, error } = await supabase.from("menus").select("*");
  if (menus) {
    callback(menus);
    console.log(timestamp(), "| Got menus:", menus);
  } else if (error) {
    console.error(timestamp(), "| Error getting menus:", error);
  }
};

// Read all menus in realtime
export const getMenusRealtime = async (callback: (menus: Menu[]) => void) => {
  getMenus(callback);
  return supabase
    .channel("menus")
    .on("postgres_changes", { event: "*", schema: "public", table: "menus" }, (payload) => {
      console.log(timestamp(), "| Got menus realtime callback:", payload);
      getMenus(callback);
    })
    .subscribe();
};

// Unsubscribe from the menus channel
export const unsubscribeMenusChannel = () => {
  supabase.removeChannel(supabase.channel("menus"));
  console.log(timestamp(), "| Unsubscribed to menus channel");
};

// Create a new menu
export const addMenu = async (menu: Omit<Menu, "docId">): Promise<String> => {
  const { data, error } = await supabase
    .from("menus")
    .insert([{ docId: uuidv4(), ...menu }])
    .select();
  if (data) {
    console.log(timestamp(), "| Added menu:", menu);
    return data[0].docId;
  } else if (error) {
    console.error("Error adding menu:", error);
  }
};

// Update a menu
export const updateMenu = async (docId: String, updates: Partial<Menu>): Promise<void> => {
  const { data, error } = await supabase.from("menus").update(updates).eq("docId", docId).select();
  if (data) {
    console.log(timestamp(), "| Updated menu:", data);
  } else if (error) {
    console.error("Error adding menu:", error);
  }
};

// Delete a menu
export const deleteMenu = async (docId: String): Promise<void> => {
  const { error } = await supabase.from("menus").delete().eq("docId", docId);
  if (error) {
    console.error("Error deleting menu:", error);
  }
};
