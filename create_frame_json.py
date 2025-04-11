import cv2
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

def process_frame(image_path: str, output_size: tuple) -> list:
    frame = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    resized_frame = cv2.resize(frame, output_size, interpolation=cv2.INTER_AREA)
    _, binary_frame = cv2.threshold(resized_frame, 128, 255, cv2.THRESH_BINARY)
    normalized_frame = binary_frame // 255
    return normalized_frame

def frames_to_js_array(frames: list) -> list:
    js_frames = []
    for frame in frames:
        js_frame = frame.tolist()
        js_frames.append(js_frame)
    return js_frames

def save_js_file(js_frames: list, output_path: str):
    with open(output_path, "w") as f:
        f.write(str(js_frames))

def process_images(input_folder: str, output_size: tuple, batch_size: int = 50) -> list:
    image_files = [os.path.join(input_folder, f) for f in os.listdir(input_folder)]
    image_files = image_files
    frames = []
    for i in range(0, len(image_files), batch_size):
        print(f"Processing images {i} to {i + batch_size}...")
        batch_files = image_files[i:i + batch_size]
        with ThreadPoolExecutor() as executor:
            future_to_file = {executor.submit(process_frame, file, output_size): file for file in batch_files}
            for future in as_completed(future_to_file):
                frames.append(future.result())
    
    return frames

def main(input_folder: str, output_file: str, output_size: tuple):
    frames = process_images(input_folder, output_size)
    js_frames = frames_to_js_array(frames)
    save_js_file(js_frames, output_file)

input_folder = "frames" 
output_file = "frames.json" 
output_size = (20, 36) 

main(input_folder, output_file, output_size)
