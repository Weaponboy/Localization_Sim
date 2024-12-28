import cv2
import os
import datetime

# Open the default camera (0)
cap = cv2.VideoCapture(0)

# Create a directory to save calibration images
os.makedirs("calibration_images", exist_ok=True)
count = 0

# Define the ROI coordinates (you can adjust these values)
startX, startY = 210, 130  # Top-left corner
endX, endY = 420, 280       # Bottom-right corner

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frameSub = frame[startY:endY, startX:endX]

    # Display the original frame
    cv2.imshow("Calibration Capture", frameSub)

    # Draw a rectangle on the frame to visualize the ROI (optional)
    cv2.rectangle(frame, (startX, startY), (endX, endY), (255, 0, 0), 2)

    # Press 'c' to capture and save the image
    if cv2.waitKey(1) & 0xFF == ord('c'):
        # Extract the ROI from the frame
        

        # Generate a timestamp for the filename
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"calibration_images/calibration_image_{timestamp}.jpg"
        
        # Save the submat (ROI) instead of the whole frame
        cv2.imwrite(filename, frameSub)
        print(f"Captured {filename}")
        count += 1
        if count >= 15:  # Stop after capturing 15 images
            break

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the camera and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()
