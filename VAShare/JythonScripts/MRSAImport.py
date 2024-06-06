'''
Created on Oct 28, 2010

@author: swt
'''

kb=""

rdfsLabelProp = kb.get
classDict = {}

def createClassLabelDictionary():
    topCls = kb.getCls("http://www.va.gov/MRSA.owl#Entity")
    subs = topCls.getSubclasses()
    for sub in subs:
        label=sub.getRDFPropertyValue(labelProp)
        if (label == None):
            label = sub.
        classDict[label] = sub

def processLine(line):        
    entries=split(line, ",")
    if (entries[0] == "add"):
        cls = kb.createOWLNamedClass()
        cls = getClassFromLabel(entries[1])

def getClassFromLabel(label):
    return classDict[label]
    
def startMRSAImport(fileName):
    input = open(fileName, 'r')
    line = input.readline()
    line = input.readline()
    line = input.readline()
    try:       
    while line != "":
        processLine(line)
        line = input.readline()
    finally:
        input.close()