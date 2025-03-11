import { DailyLog } from "../schema.type";
import supabase from "../supabase";
import { timestamp } from "../util";
import { v4 as uuidv4 } from "uuid";

// Read all daily logs
export const getDailyLogs = async (callback: (menus: DailyLog[]) => void) => {
  const { data: dailyLogs, error } = await supabase.from("dailyLogs").select("*");
  console.log(dailyLogs);
  if (dailyLogs) {
    callback(dailyLogs);
    console.log(timestamp(), "| Got daily logs:", dailyLogs);
  } else if (error) {
    console.error(timestamp(), "| Error getting daily logs:", error);
  }
};

// Read all daily logs in realtime
export const getDailyLogsRealtime = async (callback: (dailyLogs: DailyLog[]) => void) => {
  getDailyLogs(callback);
  return supabase
    .channel("dailyLogs")
    .on("postgres_changes", { event: "*", schema: "public", table: "dailyLogs" }, (payload) => {
      console.log(timestamp(), "| Got daily logs realtime callback:", payload);
      getDailyLogs(callback);
    })
    .subscribe();
};

// Unsubscribe from the daily logs channel
export const unsubscribeDailyLogsChannel = () => {
  supabase.removeChannel(supabase.channel("dailyLogs"));
  console.log(timestamp(), "| Unsubscribed to daily logs channel");
};

// Create a new daily log
export const addDailyLog = async (dailyLog: Omit<DailyLog, "docId">): Promise<String> => {
  const { data, error } = await supabase
    .from("dailyLogs")
    .insert([{ docId: uuidv4(), ...dailyLog } as DailyLog])
    .select();
  if (data) {
    console.log(timestamp(), "| Added daily log:", dailyLog);
    return data[0].docId;
  } else if (error) {
    console.error("Error adding daily log:", error);
  }
};

// Update a daily log
export const updateDailyLog = async (docId: String, updates: Partial<DailyLog>): Promise<void> => {
  const { data, error } = await supabase
    .from("dailyLogs")
    .update(updates)
    .eq("docId", docId)
    .select();
  if (data) {
    console.log(timestamp(), "| Updated daily log:", data);
  } else if (error) {
    console.error("Error adding daily log:", error);
  }
};

// Delete a daily log
export const deleteDailyLog = async (docId: String): Promise<void> => {
  const { error } = await supabase.from("dailyLogs").delete().eq("docId", docId);
  if (error) {
    console.error("Error deleting daily log:", error);
  }
};
