from PIL import Image
import os


def compress_img(dir_path, file_name, compress_rate=0.5):
    img_path = os.path.join(dir_path, file_name)
    img = Image.open(img_path)
    w, h = img.size
    img_resize = img.resize((int(w * compress_rate), int(h * compress_rate)))
    new_file_name = 'small_' + file_name
    new_img_path = os.path.join(dir_path, 'small', new_file_name)
    img_resize.save(new_img_path)
    print('succeed to compress ' + img_path)


for root, dirs, files in os.walk('./imgs'):
    for file in files:
        if file.endswith('.jpg'):
            compress_img(root, file)
