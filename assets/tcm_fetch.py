"""
本程序是将所有结果先保存到内存中，最后批量插入数据到 mysql
"""
import requests
from bs4 import BeautifulSoup
import time
import mysql.connector

headers = {'user-agent': 'Mozilla/6.0'}
base_url = "https://herbaltcm.sn.polyu.edu.hk/sc/herbal/search?page="
url_list = []

print("(1)get url list")
for page in range(1, 10):
# for page in range(1, 2):
    print("page:" + str(page))
    url = base_url + str(page) + "&type=-1&item=50"  # 设置每页 50 个结果，减少 get 次数
    html = requests.get(url=url, headers=headers)
    soup = BeautifulSoup(html.text, 'lxml')
    for div in soup.find_all('div', class_='result-item'):
        img = div.find('div', class_='chi')
        # 中药详情页的跳转链接
        url_list.append(img.contents[0].get("href"))

tcmList = []
imgList = []

print("(2)get info")
length = len(url_list)
for index in range(length):
# for index in range(1):
    print(str(index + 1) + "/" + str(length))
    html = requests.get(url=url_list[index], headers=headers)
    soup = BeautifulSoup(html.text, 'lxml')
    result = []
    # name
    name = soup.find('div', class_='name')
    print(name.find('div', class_='chi').text)

    result.append(name.find('div', class_='chi').text.strip())  # 去除首尾空格

    for xName in name.find_all('dd'):
        print(xName.text)
        # 英文、拉丁文，获取 dd 标签
        result.append(xName.text.strip())

    # props
    props = soup.find('div', class_='props').find_all('td')
    # text 自动会把 td 里面的标签删除，纯 text
    for prop in props:
        result.append(prop.text.strip())
    # accod-cont
    others = soup.find('div', class_='accod-cont')
    other = others.find_all('div', class_='cke_editable')
    for o in other[:-1]:
        result.append(o.text.strip())
    # mysql 数据需要元组
    tcmList.append(tuple(result))

    # img
    for div in soup.find_all('a', class_='clr_bx'):
        imgList.append((index + 1, div.get("href")))

    time.sleep(1)
    # print(result)

# print(tcmList)
# print(imgList)

print("(3)run sql")
connection = mysql.connector.connect(
    host="***",
    user="***",
    password="***",
    database="***"
)

insertInfo = """INSERT INTO tcm_info(name, name_eng, name_latin, medicinal_group, source, nature_flavors, meridian_affinity, actions, family, part_used, indications, cautions, adverse_effect) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""

insertImg = """INSERT INTO tcm_img(tcm_id, img_url) VALUES (%s, %s);"""
cursor = connection.cursor()

try:
    cursor.executemany(insertInfo, tcmList)
    print("insertInfo success!")
except Exception as e:
    connection.rollback()
    print("执行MySQL: %s 时出错：%s" % (insertInfo, e))

try:
    cursor.executemany(insertImg, imgList)
    print("insertImg success!")
except Exception as e:
    connection.rollback()
    print("执行MySQL: %s 时出错：%s" % (insertImg, e))

connection.commit()
cursor.close()
connection.close()
