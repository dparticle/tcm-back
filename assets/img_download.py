import os
import requests
from bs4 import BeautifulSoup
import time
import mysql.connector


def download(file_path, img_url):
    headers = {'user-agent': 'Mozilla/6.0'}
    r = requests.get(img_url, headers=headers)
    with open(file_path, 'wb') as f:
        f.write(r.content)


print('(1)get online img urls from database')
connection = mysql.connector.connect(
    host="***",
    user='***',
    password='***',
    database='***'
)

sql = """SELECT tcm_id, img_url FROM tcm_img;"""
cursor = connection.cursor()

cursor.execute(sql)
result = cursor.fetchall()

# print('(2)downloading')
#
# os.makedirs('./imgs/', exist_ok=True)  # 输出目录
#
# sql = """UPDATE tcm_img SET local_url = %s WHERE id = %s;"""
sql = """INSERT INTO tcm_img_small(tcm_id, img_url) VALUES (%s, %s);"""
tcm_id = 0
cnt = 0
try:
    for i in range(len(result)):
        if result[i][0] != tcm_id:
            tcm_id = result[i][0]
            # cnt = 0
            # 插入压缩图 url
            cnt += 1
            img_url = 'http://***:***/small/small_' + str(tcm_id) + '_0.jpg'
            cursor.execute(sql, (tcm_id, img_url))
            print('insert ' + str(tcm_id) + ' id small img')
        # else:
        #     cnt += 1
        # img_url = result[i][1]
        # file_path = './imgs/' + str(tcm_id) + '_' + str(cnt) + '.jpg'
        # local_url = 'http://***:***/' + str(tcm_id) + '_' + str(cnt) + '.jpg'
        # cursor.execute(sql, (file_path, i + 1))
        # download(file_path, img_url)
        # print('finish download ' + file_path)
        # print('update local_url ' + local_url)
    print(cnt)
except Exception as e:
    connection.rollback()


connection.commit()
cursor.close()
connection.close()
