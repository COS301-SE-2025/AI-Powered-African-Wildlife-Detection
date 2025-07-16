from flask import Flask
import cv2
import numpy as np
from ultralytics import YOLO

# === Test Flask ===
app = Flask(__name__)

@app.route("/")
def hello():
    return "Flask is working!"

if __name__ == "__main__":
    print("✅ Flask import succeeded.")

    # === Test OpenCV ===
    try:
        print("OpenCV version:", cv2.__version__)
        test_img = np.zeros((100, 100, 3), dtype=np.uint8)
        cv2.imwrite("test_img.jpg", test_img)
        print("✅ OpenCV test image saved.")
    except Exception as e:
        print("❌ OpenCV error:", e)

    # === Test Ultralytics ===
    try:
        print("🕐 Downloading YOLOv8n and running test inference...")
        model = YOLO("yolov8n.pt")
        results = model("https://ultralytics.com/images/bus.jpg")
        results[0].save(filename="result.jpg")
        print("✅ YOLO inference done. Output saved to result.jpg")
    except Exception as e:
        print("❌ Ultralytics/YOLO error:", e)

    # Comment this out later if just testing CLI
    app.run(debug=False)
