import requests
import re

def getHTMLText(url):
    try:
        headers = {'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'}
        r = requests.get(url, timeout=30,headers=headers)
        r.raise_for_status()
        r.encoding = r.apparent_encoding
        return r.text
    except:
        return "爬取失败"
    
def parsePage(html):
    try:
        plt = re.findall(r'\"view_price\"\:\"[\d\.]*\"',html)
        tlt = re.findall(r'\"raw_title\"\:\".*?\"',html)
        temp = []
        for i in range(len(plt)):
            price = eval(plt[i].split(':')[1])
            title = eval(tlt[i].split(':')[1])
            temp.append([price , title])
        return temp
    except:
        print("")

def printGoodsList(ilt):
    tplt = "{:4}\t{:8}\t{:16}"
    print(tplt.format("序号", "价格", "商品名称"))
    count = 0
    for g in ilt:
        count = count + 1
        print(tplt.format(count, g[0], g[1]))

def filterWord(list,filte):
    print('过滤方法')
    have = []
    filted = []
    for i in list:      
        word = filte.split('|')
        for j in word:
            if j in i[1]:
                have.append(i)
                break
            else:
                filted.append(i)
                break
        
    print('过滤掉的：-------------------')
    printGoodsList(have)
    print('过滤后的：-------------------')
    printGoodsList(filted)
            
def main():
    goods = '杯垫'
    filte = '创意|中式'
    depth = 1
    start_url = 'https://s.taobao.com/search?q=' + goods
    infoList = []
    for i in range(depth):
        try:
            url = start_url + '&s=' + str(44*i)
            html = getHTMLText(url)
            infoList = parsePage(html)    
        except:
            continue
    printGoodsList(infoList)
    filterWord(infoList,filte)
    
main()