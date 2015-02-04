import mechanize
import re
import json

def splitLines(html):
    lines = []
    lineStart = html.lower().find('<tr class="courseinforow">')
    lineEnd = html[lineStart + 1:].lower().find('<tr class="courseinforow">')
    i = 0
    while (lineEnd != -1):
        lineEnd += 1 + lineStart
        lines.append(html[lineStart:lineEnd])
        lineStart = lineEnd
        lineEnd = html[lineStart + 1:].lower().find('<tr class="courseinforow">')
        #print i
        #i += 1
    lineEnd = lineStart + 1 + html[lineStart + 1:].lower().find('</table>')
    lineEnd = lineEnd + 1 + html[lineEnd + 1:].lower().find('</table>')
    lineEnd = lineEnd + 1 + html[lineEnd + 1:].lower().find('</table>') #the third time will give the right index
    lines.append(html[lineStart:lineEnd])
    return lines

def lineToTable(dic, line):
    #check if class is cancelled
    indexStart = line.lower().find('class="status"')
    indexEnd = indexStart + 1 + line[indexStart + 1:].lower().find('</td>')
    if (line[indexStart:indexEnd].lower().find('cancelled') != -1):
        return dic

    indexStart = line.lower().find('<td style="text-align: left; vertical-align: middle;">') #instructor
    indexStart = indexStart + 1 + line[indexStart + 1:].lower().find('<td style="text-align: left; vertical-align: middle;">') #days
    indexEnd = indexStart + 1 + line[indexStart + 1:].lower().find('</td>')
    indexStart += line[indexStart:].lower().find('>') + 1
    days = line[indexStart:indexEnd].strip()

    indexStart = indexStart + 1 + line[indexStart + 1:].lower().find('<td style="text-align: left;') #time
    indexStart += line[indexStart:].lower().find('>') + 1
    indexEnd = indexStart + line[indexStart:].lower().find('</td>')
    time = line[indexStart:indexEnd].strip()
    n = re.search("\d", time)
    if not n:
        return dic

    indexStart = indexStart + 1 + line[indexStart + 1:].lower().find('<td style="text-align: left; vertical-align: middle;">') #room
    indexStart += line[indexStart:].lower().find('>') + 1
    indexEnd = indexStart + line[indexStart:].lower().find('</td>')
    s = line[indexStart:indexEnd].strip()
    if (s.lower() == "t b a"):
        return dic

    if (s.lower() == "musicllch"):
        roomNum = "LLCH"
        building = "MUSIC"
    elif (s.lower() == "embarhall"):
        roomNum = "MAIN"
        building = "EMBAR HALL"
    elif (s.lower() == "campbhall"):
        roomNum = "MAIN"
        building = "CAMPB HALL"
    elif (s.lower() == "musicghall"):
        roomNum = "GHALL"
        building = "MUSIC"
    elif (s.lower() == "pllokthtr"):
        roomNum = "THTR"
        building = "PLLOK"
    elif (s.lower() == "pllokstg"):
        roomNum = "STG"
        building = "PLLOK"
    elif (s.lower() == "iv thea2"):
        roomNum = "THEA2"
        building = "IV THEA"
    elif (s.lower() == "iv thea1"):
        roomNum = "THEA1"
        building = "IV THEA"
    elif (s.lower().find("msb") != -1):
        return dic
    elif (s.lower() == "scrimfield"):
        return dic
    elif (s.lower().find("hardr") != -1):
        return dic
    else:
        n = re.search(" ", s)
        if n:
            numIndex = n.start()
            roomNum = s[numIndex:].strip()
            building = s[:numIndex].strip()
        else:
            m = re.search("\d", s)
            if m:
                numIndex = m.start()
                roomNum = s[numIndex:].strip()
                building = s[:numIndex].strip()
            else:
                roomNum = ""
                building = s.strip()
        if (building == ""):
            return dic

    indexStart = indexStart + 1 + line[indexStart + 1:].lower().find('<td style="text-align: right; vertical-align: middle;">')
    indexStart += line[indexStart:].lower().find('>') + 1
    indexEnd = indexStart + line[indexStart:].lower().find('</td>')
    maxsize = line[indexStart:indexEnd].strip().split()[2]

    try:
        dic[building][roomNum]
    except KeyError:
        try:
            dic[building]
        except KeyError:
            dic[building] = {roomNum: {c: {x/(2.0): 0 for x in range(16, 40)} for c in ['m','t','w','r','f']}}
        else:
            dic[building][roomNum] = {c: {x/(2.0): 0 for x in range(16, 40)} for c in ['m','t','w','r','f']}
        dic[building][roomNum]['size'] = maxsize

    for day in days.lower():
        if (day.isalpha() and (day=='m' or day=='t' or day=='w' or day=='r' or day=='f')):
            d = dic[building][roomNum][day]
            dic[building][roomNum][day] = timeConvert(d, time)

    return dic

def timeConvert(dic, timeStr):
    time = []
    lastNumeric = False
    b = ""
    for c in timeStr:
        if (c.isdigit() and not lastNumeric):
            b = c
            lastNumeric = True
        elif (c.isdigit() and lastNumeric):
            b += c
        elif (not c.isdigit() and lastNumeric):
            lastNumeric = False
            time.append(b)
    
    start = int(time[0])
    if (start < 8):
        start += 12
    if (int(time[1]) >= 30):
        start += 0.5

    end = int(time[2])
    if (end < 8):
        end += 12
    if (int(time[3]) >= 30):
        end += 0.5

    i = start
    while (i <= end and i <= 19.5):
        dic[i] = 1
        i += 0.5
    
    return dic

def parse2(source):
    dic = {}
    startIndex = source.lower().find("UCSB Building Location Code Translations".lower())
    startIndex = startIndex + 1 + source[startIndex + 1:].lower().find("<tr>")
    startIndex = startIndex + 1 + source[startIndex + 1:].lower().find("<tr>") #first row in list
    endIndex = startIndex + 1 + source[startIndex + 1:].lower().find("</tr>")
    while (source[startIndex:endIndex].lower().find("<td>") != -1):
        dic = makeName(source[startIndex:endIndex], dic)
        startIndex = endIndex + source[endIndex:].lower().find("<tr>")
        endIndex = startIndex + 1 + source[startIndex + 1:].lower().find("</tr>")

    return dic

def makeName(source, dic):
    keyStart = source.lower().find("<td>") + 4
    keyEnd = source.lower().find("</td>")
    valueStart = keyEnd + source[keyEnd:].lower().find("<td>") + 4
    valueEnd = keyEnd + 1 + source[keyEnd + 1:].lower().find("</td>")
    key = source[keyStart:keyEnd].strip().lower()
    value = source[valueStart:valueEnd].strip()
    dic[key] = value
    return dic

courseList = ["ANTH", "ART", "ART  CS ", "ARTHI", "ARTST", "AS AM", "ASTRO", "BIOL", "BIOL CS ", "BMSE", "BL ST", "CH E", "CHEM CS ", "CHEM", "CH ST", "CHIN", "CLASS", "COMM", "C LIT", "CMPSC", "CMPSCCS ", "CNCSP", "DANCE", "DYNS", "EARTH", "EACS", "EEMB", "ECON", "ED", "ECE", "ENGR", "ENGL", "ESM", "ENV S", "FEMST", "FAMST", "FLMST", "FR", "GEN S   ", "GEN SCS ", "GEOG", "GER", "GPS", "GLOBL", "GREEK", "HEB", "HIST", "INT", "INT  CS ", "ITAL", "JAPAN", "KOR", "LATIN", "LAIS", "LING", "LIT     ", "LIT  CS ", "MARSC", "MATRL", "MATH", "MATH CS ", "ME", "MAT", "ME ST", "MES", "MS", "MCDB", "MUS", "MUS  CS ", "MUS A", "PHIL", "PHYS", "PHYS CS ", "POL S", "PORT", "PSY", "RG ST", "RENST", "SLAV", "SOC", "SPAN", "SHS", "PSTAT", "TMP", "THTR", "WRIT"]
masterDict = {}
url = "https://my.sa.ucsb.edu/public/curriculum/coursesearch.aspx"
url2 = "https://registrar.sa.ucsb.edu/locationcodes.aspx"
br = mechanize.Browser()
br.set_handle_robots(False)


for course in courseList:
    br.open(url)
    br.select_form(name="aspnetForm")
    br.form["ctl00$pageContent$courseList"] = [course,]
    print course
    br.form["ctl00$pageContent$quarterList"] = ["20151",]
    br.form["ctl00$pageContent$dropDownCourseLevels"] = ["Undergraduate",]
    res = br.submit()
    content = res.read()

    test = splitLines(content)
    #building -> room_num -> day_of_the_week -> time
    for i in range(len(test)):
        masterDict = lineToTable(masterDict, test[i])


r = br.open(url2)
html = r.read()
nameDic = parse2(html)
nameDic['387'] = 'Modular Classrooms (387)'

for building in masterDict:
    try:
        nameDic[building.lower().strip()]
    except KeyError:
        for room in masterDict[building]:
            if (building.lower() == "pllok"):
                masterDict[building][room]['name'] = "Pollock Theater"
            elif (building.lower() == "engr"):
                masterDict[building][room]['name'] = "Engineering II"
            elif (building.lower() == "ed"):
                masterDict[building][room]['name'] = "Education"
            elif (building.lower() == "ssms"):
                masterDict[building][room]['name'] = "Social Sciences and Media Studies"
            elif (building.lower() == "iv thea"):
                masterDict[building][room]['name'] = "IV Theater"
            elif (building.lower() == "iv"):
                masterDict[building][room]['name'] = "IV Theater"
            elif (building.lower() == "psy-e"):
                masterDict[building][room]['name'] = "Psychology East"
            elif (building.lower() == "mrl"):
                masterDict[building][room]['name'] = "Materials Research Lab"
            else:
                masterDict[building][room]['name'] = building
    else:
        for room in masterDict[building]:
            masterDict[building][room]['name'] = nameDic[building.lower().strip()]

for building in masterDict:
    print building + ": " + masterDict[building]['name']

with open('data2.json', 'wb') as fp:
    json.dump(masterDict, fp)
