import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Embedding, LSTM, Dense, Input, Concatenate, Subtract

# Load JSON data
file_path = "./real-data/iv_lunch_4_2.json"  # Ensure the JSON file is in the same directory
print("Loading JSON data...")
with open(file_path, "r") as file:
    meal_data = json.load(file)
print(f"Loaded {len(meal_data)} meals.")

# Extract meal names and nutritional info
meal_names = [meal["name"] for meal in meal_data]
nutritional_features = ["calories", "protein", "carbohydrates", "fat"]
meal_nutrition = []

print("Processing meal data...")
for meal in meal_data:
    nutrition = []
    for feature in nutritional_features:
        value = meal["nutritionalInfo"].get(feature, 0)
        try:
            value = float(value)  # Convert to float
        except ValueError:
            value = 0  # Handle invalid values
        nutrition.append(value)
    meal_nutrition.append(nutrition)

meal_nutrition = np.array(meal_nutrition)
print(f"Processed {len(meal_nutrition)} meals with nutritional info.")

# Tokenize meal names
print("Tokenizing meal names...")
tokenizer = Tokenizer()
tokenizer.fit_on_texts(meal_names)
meal_sequences = tokenizer.texts_to_sequences(meal_names)

# Pad sequences
max_len = max(len(seq) for seq in meal_sequences)
meal_sequences = pad_sequences(meal_sequences, maxlen=max_len, padding='post')
print(f"Meal sequences padded to length {max_len}.")

# Sample User Goals and Current Intake
user_goals = np.array([[2000, 100, 250, 70]])  # Daily goals: Calories, Protein, Carbs, Fat
user_current_intake = np.array([[800, 40, 100, 25]])  # Food consumed so far
print("User goals and current intake initialized.")

# Define Model Parameters
vocab_size = len(tokenizer.word_index) + 1
embedding_dim = 10
lstm_units = 32
nutrition_input_dim = meal_nutrition.shape[1]

print(f"Model Parameters: Vocab Size={vocab_size}, Embedding Dim={embedding_dim}, LSTM Units={lstm_units}")

# Define Inputs
meal_input = Input(shape=(max_len,))
nutrition_input = Input(shape=(nutrition_input_dim,))
goal_input = Input(shape=(nutrition_input_dim,))
current_intake_input = Input(shape=(nutrition_input_dim,))

# Meal Embedding + LSTM
print("Building model layers...")
meal_embedding = Embedding(vocab_size, embedding_dim, input_length=max_len)(meal_input)
lstm_output = LSTM(lstm_units)(meal_embedding)

# Compute Remaining Nutrition (Goals - Current Intake)
remaining_nutrition = Subtract()([goal_input, current_intake_input])

# Merge Meal, Nutrition Data, and Goal Adjustments
merged = Concatenate()([lstm_output, nutrition_input, remaining_nutrition])
dense1 = Dense(32, activation='relu')(merged)
output = Dense(vocab_size, activation='softmax')(dense1)

# Compile the Model
model = Model(inputs=[meal_input, nutrition_input, goal_input, current_intake_input], outputs=output)
model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
print("Model compiled successfully.")

# Prepare Training Data
X_meal = meal_sequences  # Keep full sequence length
X_nutrition = meal_nutrition  # Keep all nutrition features
y = meal_sequences[:, -1]  # Target meal

# Train the Model
print("Starting training...")
model.fit([X_meal, X_nutrition, np.tile(user_goals, (X_meal.shape[0], 1)), np.tile(user_current_intake, (X_meal.shape[0], 1))], 
          y, epochs=50, verbose=1)
print("Training completed.")

def predict_next_meal(meal_sequence, nutrition_values, goal_values, current_intake):
    print(f"Predicting next meal based on: {meal_sequence}")
    
    sequence = tokenizer.texts_to_sequences([meal_sequence])
    padded_seq = pad_sequences(sequence, maxlen=max_len, padding='post')
    
    prediction = model.predict([padded_seq, np.array([nutrition_values]), np.array([goal_values]), np.array([current_intake])])
    
    # Ignore index 0 (padding), select next highest probability
    sorted_indices = np.argsort(prediction[0])[::-1]
    predicted_index = next((idx for idx in sorted_indices if idx in tokenizer.index_word), None)
    
    print("Predicted Token Index:", predicted_index)
    print("Predicted Word:", tokenizer.index_word.get(predicted_index, "Unknown"))

    # Ensure prediction is a valid meal from dataset
    predicted_meal = next(
        (meal for meal in meal_names if predicted_index in tokenizer.texts_to_sequences([meal])[0]),
        "Unknown (Meal Not Found)"
    )

    print(f"Recommended Meal: {predicted_meal}")
    return predicted_meal

# Example Prediction
user_meals = [meal_names[0]]  # Use the first meal from the dataset
user_nutrition = meal_nutrition[0]  # Use actual meal nutrition values

# Print for debugging
print(f"Using User Meal: {user_meals}")
print(f"Using User Nutrition: {user_nutrition}")

predicted_meal = predict_next_meal(user_meals, user_nutrition, user_goals.flatten(), user_current_intake.flatten())

print("Final Recommended Meal:", predicted_meal)
