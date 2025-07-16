from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
from ultralytics import YOLO
import os
import logging
import traceback
import socket

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load model once at startup
try:
    model_path = "runs/detect/train/weights/best.pt"
    if not os.path.exists(model_path):
        # Fallback to your other model path
        model_path = "my_model.pt"
    
    print(f"Loading YOLO model from: {model_path}")
    model = YOLO(model_path, task="detect")
    print(f"Available classes: {list(model.names.values())}")
    
    # Get local IP address
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    print(f"Server will be accessible at: http://{local_ip}:5000")
    print("Starting Flask server...")
    
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

@app.route('/detect', methods=['POST'])
def detect():
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({"error": "Model not loaded", "success": False}), 500
        
        # Check if request has JSON data
        if not request.json:
            return jsonify({"error": "No JSON data received", "success": False}), 400
        
        data = request.json
        
        # Check if image data exists
        if 'image' not in data:
            return jsonify({"error": "No image data in request", "success": False}), 400
        
        img_data = data['image']
        
        # Validate image data format
        if not img_data or not isinstance(img_data, str):
            return jsonify({"error": "Invalid image data format", "success": False}), 400
        
        # Handle base64 image data
        try:
            # Remove data URL prefix if present
            if img_data.startswith('data:image'):
                img_data = img_data.split(',')[1]
            
            # Add padding if needed for base64 decoding
            missing_padding = len(img_data) % 4
            if missing_padding:
                img_data += '=' * (4 - missing_padding)
            
            # Decode base64 to image
            img_bytes = base64.b64decode(img_data)
            
            # Create BytesIO object and seek to beginning
            img_buffer = BytesIO(img_bytes)
            img_buffer.seek(0)
            
            # Try to open image with PIL
            try:
                image = Image.open(img_buffer)
                # Convert to RGB if needed
                if image.mode != 'RGB':
                    image = image.convert('RGB')
                
                # Convert PIL to numpy array
                frame = np.array(image)
                
                logger.info(f"Image shape: {frame.shape}, Image mode: {image.mode}")
                
            except Exception as pil_error:
                logger.error(f"PIL Error: {str(pil_error)}")
                # Try alternative method using OpenCV
                try:
                    # Convert bytes to numpy array
                    nparr = np.frombuffer(img_bytes, np.uint8)
                    # Decode image using OpenCV
                    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                    
                    if frame is None:
                        raise Exception("Failed to decode image with both PIL and OpenCV")
                    
                    # Convert BGR to RGB (OpenCV uses BGR by default)
                    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    logger.info(f"Image decoded with OpenCV - Shape: {frame.shape}")
                    
                except Exception as cv_error:
                    logger.error(f"OpenCV Error: {str(cv_error)}")
                    return jsonify({
                        "error": f"Failed to decode image: PIL error: {str(pil_error)}, OpenCV error: {str(cv_error)}", 
                        "success": False
                    }), 400
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return jsonify({"error": f"Error processing image: {str(e)}", "success": False}), 400
        
        # Run inference
        try:
            results = model(frame, verbose=False)
            
            # Check if results exist
            if not results or len(results) == 0:
                return jsonify({
                    "detections": [],
                    "count": 0,
                    "success": True,
                    "message": "No detections found"
                })
            
            detections = results[0].boxes
            
            output = []
            if detections is not None and len(detections) > 0:
                for det in detections:
                    try:
                        class_id = int(det.cls.item())
                        confidence = float(det.conf.item())
                        bbox = det.xyxy.cpu().numpy().squeeze().tolist()
                        label = model.names[class_id]
                        
                        # Ensure bbox is a list of 4 coordinates
                        if isinstance(bbox, (int, float)):
                            bbox = [bbox]
                        elif len(bbox) != 4:
                            logger.warning(f"Invalid bbox format: {bbox}")
                            continue
                        
                        output.append({
                            "class": label,
                            "confidence": confidence,
                            "bbox": bbox
                        })
                        
                    except Exception as det_error:
                        logger.error(f"Error processing detection: {str(det_error)}")
                        continue
            
            logger.info(f"Detected {len(output)} objects")
            
            return jsonify({
                "detections": output,
                "count": len(output),
                "success": True,
                "message": f"Detection completed successfully. Found {len(output)} objects."
            })
            
        except Exception as e:
            logger.error(f"Error during inference: {str(e)}")
            logger.error(traceback.format_exc())
            return jsonify({"error": f"Error during inference: {str(e)}", "success": False}), 500
        
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Unexpected error: {str(e)}", "success": False}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "classes": list(model.names.values()) if model else [],
        "success": True,
        "server_info": {
            "host": request.host,
            "remote_addr": request.remote_addr
        }
    })

@app.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({
        "message": "API is working!", 
        "success": True,
        "server_info": {
            "host": request.host,
            "remote_addr": request.remote_addr
        }
    })

# Test detection endpoint with dummy data
@app.route('/test-detection', methods=['GET'])
def test_detection():
    """Test detection with a dummy image"""
    try:
        if model is None:
            return jsonify({"error": "Model not loaded", "success": False}), 500
        
        # Create a dummy image (100x100 RGB)
        dummy_image = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)
        
        # Run inference
        results = model(dummy_image, verbose=False)
        
        return jsonify({
            "message": "Model inference test successful",
            "success": True,
            "model_classes": list(model.names.values()),
            "results": "Model can process images successfully"
        })
        
    except Exception as e:
        logger.error(f"Test detection error: {str(e)}")
        return jsonify({"error": f"Test detection failed: {str(e)}", "success": False}), 500

if __name__ == '__main__':
    # Install flask-cors if not already installed
    try:
        from flask_cors import CORS
    except ImportError:
        print("Installing flask-cors...")
        os.system("pip install flask-cors")
        from flask_cors import CORS
    
    app.run(host="0.0.0.0", port=5000, debug=True)