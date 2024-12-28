import cv2
import numpy as np
import glob

# Define the chessboard size (number of inner corners per row and column)
chessboard_size = (7, 5)    
# Size of a square in your defined unit (e.g., millimeters or inches)
square_size = 1.0

# Prepare object points (3D points in real-world space)
objp = np.zeros((chessboard_size[0] * chessboard_size[1], 3), np.float32)
objp[:, :2] = np.mgrid[0:chessboard_size[0], 0:chessboard_size[1]].T.reshape(-1, 2)
objp *= square_size

# Arrays to store object points and image points from all the images
object_points = []  # 3D points in real-world space
image_points = []  # 2D points in image plane

# Load all calibration images
images = glob.glob('calibration_images/*.jpg')  # Path to your calibration images

for image_file in images:
    img = cv2.imread(image_file)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Find the chessboard corners
    ret, corners = cv2.findChessboardCorners(gray, chessboard_size, None)
    print(f"Chessboard found in {image_file}: {ret}")

    if ret:
        object_points.append(objp)
        refined_corners = cv2.cornerSubPix(
            gray, corners, (11, 11), (-1, -1),
            criteria=(cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)
        )
        image_points.append(refined_corners)

        # Optional: Draw the detected corners and display the image
        cv2.drawChessboardCorners(img, chessboard_size, refined_corners, ret)
        cv2.imshow('Chessboard Corners', img)
        cv2.waitKey(100)
    else:
        print(f"Warning: Chessboard not detected in {image_file}")


cv2.destroyAllWindows()

# Perform camera calibration
ret, camera_matrix, dist_coeffs, rvecs, tvecs = cv2.calibrateCamera(object_points, image_points, gray.shape[::-1], None, None)

# Print calibration results
print("Camera Matrix:\n", camera_matrix)
print("Distortion Coefficients:\n", dist_coeffs)

# Save the calibration data for later use
np.savez('camera_calibration_data.npz', camera_matrix=camera_matrix, dist_coeffs=dist_coeffs)

# Test undistortion on a sample image
img = cv2.imread(images[0])
h, w = img.shape[:2]
new_camera_matrix, roi = cv2.getOptimalNewCameraMatrix(camera_matrix, dist_coeffs, (w, h), 1, (w, h))

# Undistort
undistorted_img = cv2.undistort(img, camera_matrix, dist_coeffs, None, new_camera_matrix)

# Crop the image (optional, based on ROI)
x, y, w, h = roi
undistorted_img = undistorted_img[y:y+h, x:x+w]

# Display the original and undistorted images
cv2.imshow('Original Image', img)
cv2.imshow('Undistorted Image', undistorted_img)
cv2.waitKey(0)
cv2.destroyAllWindows()
