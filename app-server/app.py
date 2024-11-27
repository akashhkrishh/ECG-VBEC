import os
import shutil
from flask import Flask, request, send_from_directory, jsonify
import matplotlib.pyplot as plt
from flask_cors import CORS
 
from Ecg import  ECG
 
ecg = ECG()

app = Flask(__name__)
CORS(app)

# Function to clean files and directories
def clean(preprocessed_data_path):
    # Walk through the directory tree
    for i in range(1, 13):
        file_name = f"Scaled_1DLead_{i}.csv"
        
        # Check if the file exists and remove it
        if os.path.exists(file_name):
            os.remove(file_name)
            # print(f"Deleted: {file_name}")
        # else:
        #     print(f"{file_name} does not exist.")
    for root, dirs, files in os.walk(preprocessed_data_path, topdown=False):
        # Remove files
        for file in files:
            file_path = os.path.join(root, file)
            os.remove(file_path)
            # print(f"File {file_path} deleted.")
        
        # Remove directories (non-empty ones using shutil)
        for dir in dirs:
            dir_path = os.path.join(root, dir)
            shutil.rmtree(dir_path)  # Recursively remove non-empty directories
            # print(f"Directory {dir_path} deleted.")


@app.route('/')
def clean_route():
    try:
        clean("preprocessed_data")  # Clean files and directories when the route is accessed
        return "Directory cleaned successfully!", 200
    except Exception as e:
        return f"Error during cleaning: {str(e)}", 500
    
@app.route('/processed_image/<filename>')
def serve_processed_image(filename):
    return send_from_directory("preprocessed_data", filename)

@app.route('/upload', methods=['POST'])
def upload_route():
    try:
        clean("preprocessed_data")
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '': 
            return jsonify({'error': 'No selected file'}), 400
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)	 
        ecg_user_image_read = ecg.getImage(file_path)
        ecg_user_gray_image_read = ecg.GrayImgae(ecg_user_image_read)
        plt.imsave("preprocessed_data/a_gray_image.jpg",ecg_user_gray_image_read,cmap="gray")

        dividing_leads=ecg.DividingLeads(ecg_user_image_read)
        ecg_preprocessed_leads = ecg.PreprocessingLeads(dividing_leads)
        ec_signal_extraction = ecg.SignalExtraction_Scaling(dividing_leads)
        ecg_1dsignal = ecg.CombineConvert1Dsignal()
        ecg_final = ecg.DimensionalReduciton(ecg_1dsignal)
        ecg_model=ecg.ModelLoad_predict(ecg_final)
        files = os.listdir("preprocessed_data")
        image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        # return jsonify(image_files)
        return jsonify({
            "result":"success",
            "predict":ecg_model,
            "ecg_1dsignal":ecg_1dsignal.to_json(orient='records'),
            "ecg_final":ecg_final.to_json(orient='records'),
            "image_files":image_files
        }), 200
           
    except Exception as e:
        return f"Error during uploading: {str(e)}", 500


if __name__ == '__main__':
    clean("preprocessed_data") 
    clean("uploads") 
    app.run(debug=True)
