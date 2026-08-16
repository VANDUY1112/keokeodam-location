import math
from PIL import Image, ImageDraw

def create_app_icon(size, output_path):
    img = Image.new("RGBA", (size, size), (15, 23, 42, 255)) # Dark slate bg
    draw = ImageDraw.Draw(img)
    
    # Rounded corners / Squircle
    corner_radius = int(size * 0.22)
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size, size], radius=corner_radius, fill=255)
    img.putalpha(mask)
    
    # Outer cyan glowing ring
    center = size / 2
    r_outer = size * 0.38
    draw.ellipse(
        [center - r_outer, center - r_outer, center + r_outer, center + r_outer],
        outline=(6, 182, 212, 100),
        width=max(2, int(size * 0.015))
    )
    
    # Inner dark disc
    r_inner = size * 0.28
    draw.ellipse(
        [center - r_inner, center - r_inner, center + r_inner, center + r_inner],
        fill=(30, 41, 59, 255),
        outline=(51, 65, 85, 255),
        width=max(2, int(size * 0.01))
    )
    
    # Triangle arrow navigation pin (Cyan-Emerald gradient feel)
    top_y = size * 0.22
    bottom_y = size * 0.72
    left_x = size * 0.26
    right_x = size * 0.74
    mid_y = size * 0.62
    
    points = [
        (center, top_y),
        (right_x, bottom_y),
        (center, mid_y),
        (left_x, bottom_y)
    ]
    draw.polygon(points, fill=(6, 182, 212, 255))
    
    # Right half shadow/contrast
    right_points = [
        (center, top_y),
        (right_x, bottom_y),
        (center, mid_y)
    ]
    draw.polygon(right_points, fill=(16, 185, 129, 255))
    
    # Center white dot
    r_dot = size * 0.05
    draw.ellipse(
        [center - r_dot, center - r_dot, center + r_dot, center + r_dot],
        fill=(255, 255, 255, 255)
    )
    
    img.save(output_path, "PNG")
    print(f"Saved {output_path} ({size}x{size})")

create_app_icon(180, "c:/house/keokeodam-location/public/apple-touch-icon.png")
create_app_icon(192, "c:/house/keokeodam-location/public/icon-192.png")
create_app_icon(512, "c:/house/keokeodam-location/public/icon-512.png")
