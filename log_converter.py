import re
import json
import pandas as pd
import os

def extract_json_from_file(input_file, output_folder):
    """
    Extracts JSON-like structures from a file, converts them into a DataFrame,
    and saves the result as a CSV file in a specified folder.

    Args:
        input_file (str): Path to the input file containing raw data.
        output_folder (str): Folder where the extracted data will be saved.
        output_filename (str, optional): Name of the output CSV file. Defaults to "extracted_data.csv".
    """

    json_like_data = []
    json_list_pattern = re.compile(r"\[\{.*?\}\]")  # Regex pattern to match JSON-like lists of dictionaries

    # Ensure output directory exists
    os.makedirs(output_folder, exist_ok=True)

    output_filename = os.path.basename(input_file).replace(".txt", ".csv")

    # Read file and process line by line
    with open(input_file, "r", encoding="utf-8") as file:
        for line in file:
            matches = json_list_pattern.findall(line)
            for match in matches:
                try:
                    parsed = json.loads(match)
                    if isinstance(parsed, list) and all(isinstance(i, dict) for i in parsed):
                        json_like_data.extend(parsed)
                except json.JSONDecodeError:
                    continue  # Skip invalid JSON entries

    # Convert to DataFrame
    if json_like_data:
        df = pd.DataFrame(json_like_data)
        output_path = os.path.join(output_folder, output_filename)
        df.to_csv(output_path, index=False, encoding="utf-8")

        # Display extracted data to user
        print(df.head())
        print(f"Data successfully extracted and saved to: {output_path}")
    else:
        print("No valid JSON structures found in the file.")

# Example usage
input_file_path = "/Users/leasyrin/Downloads/IUB_PhD/Projects/magnitude/console_logs/console_logs_2025-02-09T23_40_56.591Z.txt"  # Replace with actual file path
output_directory = "/Users/leasyrin/Downloads/IUB_PhD/Projects/magnitude/console_logs"  # Folder where CSV will be saved
extract_json_from_file(input_file_path, output_directory)
