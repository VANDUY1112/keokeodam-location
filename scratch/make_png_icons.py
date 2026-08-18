import math
from PIL import Image, ImageDraw

def create_app_icon(size, output_path):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw circular dark background (Slate 900)
    pad = max(1, int(size * 0.04))
    draw.ellipse([pad, pad, size - pad, size - pad], fill=(15, 23, 42, 255), outline=(30, 41, 59, 255), width=max(1, int(size * 0.03)))
    
    # Accurate rotated pointer (Tip pointing ↗ North-East / 45deg)
    # Upright coordinates relative to center:
    # Tip: (0, -18), Right: (11, 14), Notch: (0, 7), Left: (-11, 14)
    # Rotated by 45 deg:
    cos45 = math.cos(math.radians(45))
    sin45 = math.sin(math.radians(45))
    
    scale = size / 64.0
    raw_points = [
        (0.0, -18.0),   # Tip
        (11.0, 14.0),   # Right wing
        (0.0, 7.0),     # Notch
        (-11.0, 14.0),  # Left wing
    ]
    
    center = size / 2.0
    transformed_points = []
    for (rx, ry) in raw_points:
        # Rotate by +45 deg
        tx = rx * cos45 - ry * sin45
        ty = rx * sin45 + ry * cos45
        # Scale and offset
        px = center + tx * scale
        py = center + ty * scale
        transformed_points.append((int(round(px)), int(round(py))))
        
    draw.polygon(transformed_points, fill=(255, 255, 255, 255))
    
    img.save(output_path)
    print(f"Saved {output_path} ({size}x{size})")
    return img

# Save PNG icons
create_app_icon(32, "c:/house/keokeodam-location/public/favicon.png")
create_app_icon(48, "c:/house/keokeodam-location/public/favicon-48.png")
create_app_icon(180, "c:/house/keokeodam-location/public/apple-touch-icon.png")
create_app_icon(192, "c:/house/keokeodam-location/public/icon-192.png")
create_app_icon(512, "c:/house/keokeodam-location/public/icon-512.png")
create_app_icon(16, "c:/house/keokeodam-location/public/favicon-16.png")
icon_64 = create_app_icon(64, "c:/house/keokeodam-location/public/favicon-64.png")

# Save multi-size favicon.ico
icon_64.save(
    "c:/house/keokeodam-location/public/favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)
print("Saved c:/house/keokeodam-location/public/favicon.ico")
