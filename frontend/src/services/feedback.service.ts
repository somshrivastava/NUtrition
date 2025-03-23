import { v4 as uuidv4 } from "uuid";

import supabase from "../supabase";
import { timestamp } from "../util";
import { FeedbackForm } from "../schema.type";

// Create a new feedback
export const addFeedback = async (feedback: Omit<FeedbackForm, "docId">): Promise<String> => {
  const { data, error } = await supabase
    .from("feedback")
    .insert([{ docId: uuidv4(), ...feedback }])
    .select();
  if (data) {
    console.log(timestamp(), "| Added feedback:", feedback);
    return data[0].docId;
  } else if (error) {
    console.error("Error adding feedback:", error);
  }
};
