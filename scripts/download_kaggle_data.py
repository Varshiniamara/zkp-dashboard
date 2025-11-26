import kaggle
import os

def download_kaggle_dataset(dataset_id, path):
    print(f"Downloading {dataset_id} to {path}...")
    kaggle.api.dataset_download_files(dataset_id, path=path, unzip=True)
    print(f"Successfully downloaded {dataset_id}.")

if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'test', 'data', 'kaggle')
    os.makedirs(data_dir, exist_ok=True)

    # Datasets to download
    datasets = {
        "fedesoriano/stroke-prediction-dataset": "stroke_prediction",
        "rupakroy/credit-score-classification-dataset": "credit_score",
        "mysarahmad/bank-marketing-campaign-dataset": "bank_marketing"
    }

    for dataset_id, folder_name in datasets.items():
        dataset_path = os.path.join(data_dir, folder_name)
        os.makedirs(dataset_path, exist_ok=True)
        download_kaggle_dataset(dataset_id, dataset_path)

    print("All specified Kaggle datasets downloaded.")
